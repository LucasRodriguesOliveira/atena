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
import { removeAndCheck } from './utils/remove-and-check';
import { removeUser } from './utils/remove/remove-user';
import { AuthController } from '../src/modules/auth/auth.controller';
import { UserTypeEnum } from '../src/modules/user-type/type/user-type.enum';
import { addRepository } from './utils/repository';
import { User } from '../src/modules/user/entity/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const basePath = '/auth';

  let authController: AuthController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
      ],
    }).compile();

    authController = moduleFixture.get<AuthController>(AuthController);

    addRepository({
      testingModule: moduleFixture,
      name: [User.name],
    });

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/register', () => {
    const path = `${basePath}/register`;

    describe('(POST)', () => {
      describe(`BAD_REQUEST - ${HttpStatus.BAD_REQUEST}`, () => {
        it('should throw an error due to the lack of data sent', () => {
          return request(app.getHttpServer())
            .post(path)
            .expect(HttpStatus.BAD_REQUEST);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        const registerDto: RegisterDto = register.default;

        beforeAll(() => {
          registerDto.username = `${registerDto.username}/${Date.now()}`;
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `User (${registerDto.username})`,
            removeFunction: async () =>
              removeUser({ username: registerDto.username }),
          });
        });

        it('should register a user and return true', () => {
          return request(app.getHttpServer())
            .post(path)
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
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `User (${loginDto.username})`,
            removeFunction: async () =>
              removeUser({ username: loginDto.username }),
          });
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
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `User (${loginDto.username})`,
            removeFunction: async () =>
              removeUser({ username: loginDto.username }),
          });
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
