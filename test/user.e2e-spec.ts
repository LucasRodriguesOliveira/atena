import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envConfig } from '../src/config/env/env.config';
import { typeOrmModuleConfig } from '../src/config/typeorm/typeorm-module.config';
import { UserType } from '../src/modules/user-type/entity/user-type.entity';
import { User } from '../src/modules/user/entity/user.entity';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { AuthModule } from '../src/modules/auth/auth.module';
import { LoginDto } from '../src/modules/auth/dto/login.dto';
import { UserService } from '../src/modules/user/user.service';
import { UserResult } from '../src/modules/user/dto/user-result.dto';
import { UserTypeEnum } from '../src/modules/user-type/type/user-type.enum';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const userService = {
    findByUsername: jest.fn(),
    hashPassword: jest.fn((password) => password),
    find: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeOrmModule.forRootAsync(typeOrmModuleConfig([User, UserType])),
        AuthModule,
        UserModule,
      ],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/', () => {
    it(`GET - ${HttpStatus.UNAUTHORIZED}`, () => {
      return request(app.getHttpServer())
        .get('/user')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    const user: Partial<User> = {
      id: '0',
      password: '12345',
    };

    const userResult: UserResult = {
      id: '0',
      type: UserTypeEnum.ADMIN,
      name: 'test',
      username: 'test.test',
    };

    const loginDto: LoginDto = {
      username: 'test',
      password: '12345',
      remember: false,
    };

    let token: string;

    const userList = [user, { ...user, id: '1' }, { ...user, id: '2' }];

    describe(UserTypeEnum.ADMIN, () => {
      beforeEach(async () => {
        userService.findByUsername.mockResolvedValueOnce(user);
        userService.find.mockResolvedValueOnce(userResult);
        userService.list.mockResolvedValueOnce(userList);

        const { body } = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDto);

        token = `Bearer ${body.token}`;
      });

      it(`GET - ${HttpStatus.OK}`, () => {
        return request(app.getHttpServer())
          .get('/user')
          .set('authorization', token)
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body).toHaveLength(3);
            expect(response.body).toStrictEqual(userList);
          });
      });
    });

    describe(UserTypeEnum.DEFAULT, () => {
      beforeEach(async () => {
        userResult.type = UserTypeEnum.DEFAULT;
        userService.findByUsername.mockResolvedValueOnce(user);
        userService.find.mockResolvedValueOnce(userResult);
        userService.list.mockResolvedValueOnce(userList);

        const { body } = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDto);

        token = `Bearer ${body.token}`;
      });

      it(`GET - ${HttpStatus.FORBIDDEN}`, () => {
        return request(app.getHttpServer())
          .get('/user')
          .set('authorization', token)
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });

  describe('/:userId', () => {
    describe('GET', () => {
      const user: Partial<User> = {
        id: '0',
        password: '12345',
      };

      const userResult: UserResult = {
        id: '0',
        type: UserTypeEnum.DEFAULT,
        name: 'test',
        username: 'test.test',
      };

      const loginDto: LoginDto = {
        username: 'test',
        password: '12345',
        remember: false,
      };

      let token: string;

      beforeEach(async () => {
        userService.findByUsername.mockResolvedValueOnce(user);
        userService.find.mockResolvedValue(userResult);

        const { body } = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDto);

        token = `Bearer ${body.token}`;
      });

      it(`${HttpStatus.UNAUTHORIZED}`, () => {
        return request(app.getHttpServer())
          .get(`/user/${user.id}`)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it(`${HttpStatus.OK}`, () => {
        return request(app.getHttpServer())
          .get(`/user/${user.id}`)
          .set('authorization', token)
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body).toStrictEqual(userResult);
          });
      });
    });

    describe('PUT', () => {
      const user: Partial<User> = {
        id: '0',
        password: '12345',
      };

      const userResult: UserResult = {
        id: '0',
        type: UserTypeEnum.DEFAULT,
        name: 'test',
        username: 'test.test',
      };

      const loginDto: LoginDto = {
        username: 'test',
        password: '12345',
        remember: false,
      };

      const updateUserDto: UpdateUserDto = {
        name: 'updated test',
      };

      let token: string;

      beforeEach(async () => {
        userService.findByUsername.mockResolvedValueOnce(user);
        userService.find.mockResolvedValue(userResult);
        userService.update.mockResolvedValueOnce(user);

        const { body } = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDto);

        token = `Bearer ${body.token}`;
      });

      it(`${HttpStatus.UNAUTHORIZED}`, () => {
        return request(app.getHttpServer())
          .put(`/user/${user.id}`)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it(`${HttpStatus.OK}`, () => {
        return request(app.getHttpServer())
          .put(`/user/${user.id}`)
          .set('authorization', token)
          .send(updateUserDto)
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body).toStrictEqual(user);
          });
      });
    });

    describe('DELETE', () => {
      const user: Partial<User> = {
        id: '0',
        password: '12345',
      };

      const userResult: UserResult = {
        id: '0',
        type: UserTypeEnum.ADMIN,
        name: 'test',
        username: 'test.test',
      };

      const loginDto: LoginDto = {
        username: 'test',
        password: '12345',
        remember: false,
      };

      let token: string;

      it(`${HttpStatus.UNAUTHORIZED}`, () => {
        return request(app.getHttpServer())
          .delete(`/user/${user.id}`)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      describe('ADMIN', () => {
        beforeEach(async () => {
          userService.findByUsername.mockResolvedValueOnce(user);
          userService.find.mockResolvedValue(userResult);
          userService.delete.mockResolvedValueOnce(true);

          const { body } = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto);

          token = `Bearer ${body.token}`;
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .delete(`/user/${user.id}`)
            .set('authorization', token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(JSON.parse(response.text)).toBe(true);
            });
        });
      });

      describe('DEFAULT', () => {
        beforeEach(async () => {
          userResult.type = UserTypeEnum.DEFAULT;
          userService.findByUsername.mockResolvedValueOnce(user);
          userService.find.mockResolvedValue(userResult);
          userService.delete.mockResolvedValueOnce(true);

          const { body } = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto);

          token = `Bearer ${body.token}`;
        });

        it(`${HttpStatus.FORBIDDEN}`, () => {
          return request(app.getHttpServer())
            .delete(`/user/${user.id}`)
            .set('authorization', token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });
    });
  });
});
