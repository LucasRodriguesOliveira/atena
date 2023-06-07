import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { UserType } from '../src/modules/user-type/entity/user-type.entity';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { CreateUserTypeDto } from '../src/modules/user-type/dto/create-user-type.dto';
import { CreateUserTypeResponse } from '../src/modules/user-type/dto/create-user-type-response.dto';
import { UpdateUserTypeDto } from '../src/modules/user-type/dto/update-user-type.dto';
import { UserTypeController } from '../src/modules/user-type/user-type.controller';
import { createUserType } from './utils/create/create-user-type';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { RepositoryManager } from './utils/repository';
import { RepositoryItem } from './utils/repository/repository-item';

describe('UserTypeController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/user-type';
  const headers = {
    auth: 'authorization',
  };

  let userTypeController: UserTypeController;

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

    userTypeController =
      moduleFixture.get<UserTypeController>(UserTypeController);
    repositoryManager = new RepositoryManager(moduleFixture);
    repositoryManager.add([new RepositoryItem(UserType)]);

    app = moduleFixture.createNestApplication();
    await app.init();

    getToken = await getTokenFactory({
      testingModule: moduleFixture,
      testName: 'UserType.e2e',
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
        let createUserTypeResponse: CreateUserTypeResponse;

        beforeAll(async () => {
          token = await getToken.admin();
          createUserTypeResponse = await createUserType({
            userTypeController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(UserType.name, {
            id: createUserTypeResponse.id,
          });
        });

        it('should return a list of userTypes', () => {
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

    describe('(POST)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow access to the route without a jwt token', () => {
          return request(app.getHttpServer())
            .post(basePath)
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
            .post(basePath)
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`CREATED - ${HttpStatus.CREATED}`, () => {
        let token: string;

        const createUserTypeDto: CreateUserTypeDto = {
          description: 'test',
        };

        let userTypeId: number;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(UserType.name, {
            id: userTypeId,
          });
        });

        it('should create a userType', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .send(createUserTypeDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('id');

              userTypeId = response.body.id;
            });
        });
      });

      describe(`BAD_REQUEST - ${HttpStatus.BAD_REQUEST}`, () => {
        let token: string;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        it('should throw an error due to the lack of data sent', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .expect(HttpStatus.BAD_REQUEST);
        });
      });
    });
  });

  describe('/:userTypeId', () => {
    const path = `${basePath}/:userTypeId`;
    const pathTo = (userTypeId: number) =>
      path.replace(/:userTypeId/, `${userTypeId}`);

    describe('(PUT)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow access to the route without a jwt token', () => {
          return request(app.getHttpServer())
            .put(pathTo(-1))
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
            .put(pathTo(-1))
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`BAD_REQUEST - ${HttpStatus.BAD_REQUEST}`, () => {
        let token: string;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        it('should throw an error due to the lack of data sent', () => {
          return request(app.getHttpServer())
            .put(pathTo(-1))
            .set(headers.auth, token)
            .expect(HttpStatus.BAD_REQUEST);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;

        const updateUserTypeDto: UpdateUserTypeDto = {
          description: 'test',
        };

        let userType: CreateUserTypeResponse;

        beforeAll(async () => {
          token = await getToken.admin();
          userType = await createUserType({
            userTypeController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(UserType.name, {
            id: userType.id,
          });
        });

        it('should update a userType', () => {
          return request(app.getHttpServer())
            .put(pathTo(userType.id))
            .set(headers.auth, token)
            .send(updateUserTypeDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', userType.id);
              expect(response.body).toHaveProperty(
                'description',
                updateUserTypeDto.description,
              );
            });
        });
      });
    });

    describe('(DELETE)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow access to the route without a jwt token', () => {
          return request(app.getHttpServer())
            .delete(pathTo(-1))
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
            .delete(pathTo(-1))
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;
        let userType: CreateUserTypeResponse;

        beforeAll(async () => {
          token = await getToken.admin();
          userType = await createUserType({
            userTypeController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(UserType.name, {
            id: userType.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .delete(pathTo(userType.id))
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
