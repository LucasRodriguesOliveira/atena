import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envConfig } from '../src/config/env/env.config';
import { typeOrmModuleConfig } from '../src/config/typeorm/typeorm-module.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { User } from '../src/modules/user/entity/user.entity';
import * as request from 'supertest';
import { UserService } from '../src/modules/user/user.service';
import { RegisterDto } from '../src/modules/auth/dto/register.dto';
import { UserType } from '../src/modules/user-type/entity/user-type.entity';
import { LoginDto } from '../src/modules/auth/dto/login.dto';
import { JWTService } from '../src/modules/auth/jwt.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const userService = {
    create: jest.fn(),
    findByUsername: jest.fn(),
    updateToken: jest.fn(),
    hashPassword: jest.fn((password) => password),
  };
  const jwtService = {
    sign: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeOrmModule.forRootAsync(typeOrmModuleConfig([User, UserType])),
        AuthModule,
      ],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .overrideProvider(JWTService)
      .useValue(jwtService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/register', () => {
    const body: RegisterDto = {
      name: 'test',
      username: 'test.test',
      password: '12345',
      userTypeId: 1,
    };

    const user = {
      id: '0',
      name: 'test',
      username: 'test.test',
    };

    beforeEach(() => {
      userService.create.mockResolvedValueOnce(user);
    });

    it(`POST - ${HttpStatus.OK}`, () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(body)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(JSON.parse(response.text)).toBe(true);
        });
    });

    it(`POST - ${HttpStatus.BAD_REQUEST}`, () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...body, name: '' })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/login', () => {
    const body: LoginDto = {
      password: '12345',
      remember: false,
      username: 'test.test',
    };

    const user = {
      id: '0',
      password: '12345',
      token: null,
    };

    const token = 'token';

    beforeEach(() => {
      userService.findByUsername.mockResolvedValue(user);
      userService.updateToken.mockResolvedValue(user);
      jwtService.sign.mockResolvedValue(token);
    });

    it(`POST - ${HttpStatus.OK}`, () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(body)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toStrictEqual({ token });
        });
    });

    it(`POST - ${HttpStatus.FORBIDDEN}`, () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...body, password: 'wrong password' })
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
