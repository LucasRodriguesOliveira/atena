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
import { UserService } from '../src/modules/user/user.service';
import { UserResult } from '../src/modules/user/dto/user-result.dto';
import { UserTypeEnum } from '../src/modules/user-type/type/user-type.enum';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { getTokenFactory } from './utils/get-token';
import { UpdateUserResponseDto } from '../src/modules/user/dto/update-user-response.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const basePath = '/user';
  const userService = {
    findByUsername: jest.fn(),
    hashPassword: jest.fn((password) => password),
    comparePassword: jest.fn(),
    find: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  let getToken: () => Promise<string>;

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
    getToken = getTokenFactory(app, userService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/', () => {
    it(`GET - ${HttpStatus.UNAUTHORIZED}`, () => {
      return request(app.getHttpServer())
        .get(basePath)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    describe(UserTypeEnum.ADMIN, () => {
      const userResult: UserResult = {
        id: '0',
        type: UserTypeEnum.ADMIN,
        name: 'test',
        username: 'test.test',
      };
      let token: string;
      const userList = [{ id: '0' }, { id: '1' }];

      beforeEach(async () => {
        userService.find.mockResolvedValueOnce(userResult);
        userService.list.mockResolvedValueOnce(userList);

        token = await getToken();
      });

      it(`GET - ${HttpStatus.OK}`, () => {
        return request(app.getHttpServer())
          .get(basePath)
          .set('authorization', token)
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body).toHaveLength(2);
            expect(response.body).toStrictEqual(userList);
          });
      });
    });

    describe(UserTypeEnum.DEFAULT, () => {
      const userResult: UserResult = {
        id: '0',
        type: UserTypeEnum.DEFAULT,
        name: 'test',
        username: 'test.test',
      };
      let token: string;

      beforeEach(async () => {
        userService.find.mockResolvedValueOnce(userResult);

        token = await getToken();
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
    const userId = '0';
    const path = `${basePath}/${userId}`;

    describe('GET', () => {
      const userResult: UserResult = {
        id: userId,
        type: UserTypeEnum.DEFAULT,
        name: 'test',
        username: 'test.test',
      };

      let token: string;

      beforeEach(async () => {
        userService.find.mockResolvedValue(userResult);
        token = await getToken();
      });

      it(`${HttpStatus.UNAUTHORIZED}`, () => {
        return request(app.getHttpServer())
          .get(path)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it(`${HttpStatus.OK}`, () => {
        return request(app.getHttpServer())
          .get(path)
          .set('authorization', token)
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body).toStrictEqual(userResult);
          });
      });
    });

    describe('PUT', () => {
      const userResult: UserResult = {
        id: '0',
        type: UserTypeEnum.DEFAULT,
        name: 'test',
        username: 'test.test',
      };

      const updateUserDto: UpdateUserDto = {
        name: 'updated test',
      };

      const userExpected = UpdateUserResponseDto.from({
        id: userId,
        name: 'test',
        password: '123',
        token: null,
        username: 'test',
        type: {
          id: 0,
          description: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
          users: [],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      });

      let token: string;

      beforeEach(async () => {
        userService.find.mockResolvedValue(userResult);
        userService.update.mockResolvedValueOnce(userExpected);
        token = await getToken();
      });

      it(`${HttpStatus.UNAUTHORIZED}`, () => {
        return request(app.getHttpServer())
          .put(path)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it(`${HttpStatus.OK}`, () => {
        return request(app.getHttpServer())
          .put(path)
          .set('authorization', token)
          .send(updateUserDto)
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body).toHaveProperty('id', userExpected.id);
            expect(response.body).toHaveProperty('name', userExpected.name);
            expect(response.body).toHaveProperty(
              'username',
              userExpected.username,
            );
            expect(response.body).toHaveProperty('type', userExpected.type);
          });
      });
    });

    describe('DELETE', () => {
      let token: string;

      it(`${HttpStatus.UNAUTHORIZED}`, () => {
        return request(app.getHttpServer())
          .delete(path)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      describe('ADMIN', () => {
        const userResult: UserResult = {
          id: '0',
          type: UserTypeEnum.ADMIN,
          name: 'test',
          username: 'test.test',
        };

        beforeEach(async () => {
          userService.find.mockResolvedValue(userResult);
          userService.delete.mockResolvedValueOnce(true);
          token = await getToken();
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .delete(path)
            .set('authorization', token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(JSON.parse(response.text)).toBe(true);
            });
        });
      });

      describe('DEFAULT', () => {
        const userResult: UserResult = {
          id: '0',
          type: UserTypeEnum.DEFAULT,
          name: 'test',
          username: 'test.test',
        };

        beforeEach(async () => {
          userService.find.mockResolvedValue(userResult);
          userService.delete.mockResolvedValueOnce(true);
          token = await getToken();
        });

        it(`${HttpStatus.FORBIDDEN}`, () => {
          return request(app.getHttpServer())
            .delete(path)
            .set('authorization', token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });
    });
  });
});
