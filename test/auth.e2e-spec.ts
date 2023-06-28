import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import * as request from 'supertest';
import { RegisterDto } from '../src/modules/auth/dto/register.dto';
import { LoginDto } from '../src/modules/auth/dto/login.dto';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { createUser, register } from './utils/create/create-user';
import { AuthController } from '../src/modules/auth/auth.controller';
import { UserTypeEnum } from '../src/modules/user-type/type/user-type.enum';
import { User } from '../src/modules/user/entity/user.entity';
import { RepositoryManager } from './utils/repository';
import { RepositoryItem } from './utils/repository/repository-item';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const basePath = '/auth';

  let authController: AuthController;
  let repositoryManager: RepositoryManager;

  let getToken: TokenFactoryResponse;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
      ],
    }).compile();

    authController = moduleFixture.get<AuthController>(AuthController);
    repositoryManager = new RepositoryManager(moduleFixture);

    repositoryManager.add([new RepositoryItem(User)]);

    app = moduleFixture.createNestApplication();
    await app.init();

    getToken = await getTokenFactory({
      testingModule: moduleFixture,
      testName: 'auth.e2e',
    });
  });

  afterAll(async () => {
    await getToken.clear();
    await app.close();
  });

  describe('/register', () => {
    const path = `${basePath}/register`;

    describe('(POST)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow access to the route without a token', () => {
          return request(app.getHttpServer())
            .post(path)
            .expect(HttpStatus.UNAUTHORIZED);
        });
      });

      describe(`BAD_REQUEST - ${HttpStatus.BAD_REQUEST}`, () => {
        let token: string;

        beforeEach(async () => {
          token = await getToken.admin();
        });

        it('should throw an error due to the lack of data sent', () => {
          return request(app.getHttpServer())
            .post(path)
            .set('authorization', token)
            .expect(HttpStatus.BAD_REQUEST);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;
        const registerDto: RegisterDto = register.default;

        beforeAll(async () => {
          registerDto.username = `${registerDto.username}/${Date.now()}`;
          token = await getToken.admin();
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(
            User.name,
            { username: registerDto.username },
            false,
          );
        });

        it('should register a user and return true', () => {
          return request(app.getHttpServer())
            .post(path)
            .set('authorization', token)
            .send(registerDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(JSON.parse(response.text)).toBe(true);
            });
        });
      });
    });
  });

  describe('/login', () => {
    const path = `${basePath}/login`;
    describe('(POST)', () => {
      describe(`FORBIDDEN - ${HttpStatus.FORBIDDEN}`, () => {
        const loginDto: LoginDto = {
          password: 'wrong password',
          username: '',
          remember: false,
        };

        beforeAll(async () => {
          loginDto.username = await createUser({
            authController,
            userType: UserTypeEnum.DEFAULT,
            override: true,
            testName: 'auth.e2e',
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(
            User.name,
            { username: loginDto.username },
            false,
          );
        });

        it('should throw an error for passing the wrong password', () => {
          return request(app.getHttpServer())
            .post(path)
            .send(loginDto)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        const loginDto: LoginDto = {
          password: register.default.password,
          username: '',
          remember: false,
        };

        beforeAll(async () => {
          loginDto.username = await createUser({
            authController,
            userType: UserTypeEnum.DEFAULT,
            override: true,
            testName: 'auth.e2e',
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(
            User.name,
            { username: loginDto.username },
            false,
          );
        });

        it('should login successfully and get a access token', () => {
          return request(app.getHttpServer())
            .post(path)
            .send(loginDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.text).toBeTruthy();
              expect(response.text.length).toBeGreaterThanOrEqual(50);
            });
        });
      });
    });
  });
});
