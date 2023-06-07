import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { User } from '../src/modules/user/entity/user.entity';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { AuthModule } from '../src/modules/auth/auth.module';
import { UserTypeEnum } from '../src/modules/user-type/type/user-type.enum';
import { UpdateUserDto } from '../src/modules/user/dto/update-user.dto';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { createUser } from './utils/create/create-user';
import { AuthController } from '../src/modules/auth/auth.controller';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { randomUUID } from 'crypto';
import { RepositoryManager } from './utils/repository';
import { RepositoryItem } from './utils/repository/repository-item';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/user';
  const headers = {
    auth: 'authorization',
  };

  let authController: AuthController;

  let repositoryManager: RepositoryManager;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
        UserModule,
        UserTypeModule,
      ],
    }).compile();

    authController = moduleFixture.get<AuthController>(AuthController);
    repositoryManager = new RepositoryManager(moduleFixture);
    repositoryManager.add([new RepositoryItem(User)]);

    app = moduleFixture.createNestApplication();
    await app.init();

    getToken = await getTokenFactory({
      testingModule: moduleFixture,
    });
  });

  afterAll(async () => {
    await getToken.clear();
    await app.close();
  });

  describe('/', () => {
    describe('(GET)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow access to the route without a jwt token', () => {
          return request(app.getHttpServer())
            .get(basePath)
            .expect(HttpStatus.UNAUTHORIZED);
        });
      });

      describe(`FORBIDDEN - ${HttpStatus.FORBIDDEN}`, () => {
        let token: string;

        beforeAll(async () => {
          token = await getToken.default();
        });

        it('should not allow access to the route due to user type is not admin', () => {
          return request(app.getHttpServer())
            .get(basePath)
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;
        let username: string;

        beforeAll(async () => {
          token = await getToken.admin();
          username = await createUser({
            authController,
            userType: UserTypeEnum.DEFAULT,
            override: true,
            testName: 'user.e2e',
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(User.name, { username });
        });

        it('should return a list of users', () => {
          return request(app.getHttpServer())
            .get(basePath)
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('length');
              expect(response.body.length).toBeGreaterThanOrEqual(1);
            });
        });
      });
    });
  });

  describe('/:userId', () => {
    const path = `${basePath}/:userId`;
    const pathTo = (userId: string) => path.replace(/:userId/, userId);

    describe('(GET)', () => {
      describe(`NOT_FOUND - ${HttpStatus.NOT_FOUND}`, () => {
        let token: string;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        it('should throw an error due to not finding the user', () => {
          return request(app.getHttpServer())
            .get(pathTo(randomUUID()))
            .set(headers.auth, token)
            .expect(HttpStatus.NOT_FOUND);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;
        let username: string;
        let userId: string;

        beforeAll(async () => {
          token = await getToken.admin();
          username = await createUser({
            authController,
            userType: UserTypeEnum.DEFAULT,
            override: true,
            testName: 'user.e2e',
          });

          const user = await repositoryManager.find<User>(User.name, {
            username,
          });
          userId = user.id;
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(User.name, { id: userId });
        });

        it('should find a user by id', () => {
          return request(app.getHttpServer())
            .get(pathTo(userId))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', userId);
            });
        });
      });
    });

    describe('(PUT)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow access to the route without a jwt token', () => {
          return request(app.getHttpServer())
            .put(pathTo(randomUUID()))
            .expect(HttpStatus.UNAUTHORIZED);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        const updateUserDto: UpdateUserDto = {
          name: 'updated test',
        };

        let token: string;
        let userId: string;
        let username: string;

        beforeAll(async () => {
          token = await getToken.admin();
          username = await createUser({
            authController,
            userType: UserTypeEnum.DEFAULT,
            override: true,
            testName: 'user.e2e',
          });
          const user = await repositoryManager.find<User>(User.name, {
            username,
          });
          userId = user.id;
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(User.name, { id: userId });
        });

        it('should update a user', () => {
          return request(app.getHttpServer())
            .put(pathTo(userId))
            .set(headers.auth, token)
            .send(updateUserDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', userId);
              expect(response.body).toHaveProperty('name', updateUserDto.name);
              expect(response.body).toHaveProperty('username');
              expect(response.body).toHaveProperty('type');
            });
        });
      });
    });

    describe('(DELETE)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow access to the route without a jwt token', () => {
          return request(app.getHttpServer())
            .delete(pathTo(randomUUID()))
            .expect(HttpStatus.UNAUTHORIZED);
        });
      });

      describe(`FORBIDDEN - ${HttpStatus.FORBIDDEN}`, () => {
        let token: string;

        beforeAll(async () => {
          token = await getToken.default();
        });

        it('should not allow access to the route due to user type is not admin', () => {
          return request(app.getHttpServer())
            .delete(pathTo(randomUUID()))
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;
        let userId: string;
        let username: string;

        beforeAll(async () => {
          token = await getToken.admin();
          username = await createUser({
            authController,
            userType: UserTypeEnum.DEFAULT,
            override: true,
            testName: 'user.e2e',
          });
          const user = await repositoryManager.find<User>(User.name, {
            username,
          });
          userId = user.id;
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(User.name, { id: userId });
        });

        it('should delete a user', () => {
          return request(app.getHttpServer())
            .delete(pathTo(userId))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(JSON.parse(response.text)).toBe(true);
            });
        });
      });
    });
  });
});
