import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envConfig } from '../src/config/env/env.config';
import { typeOrmModuleConfig } from '../src/config/typeorm/typeorm-module.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { Permission } from '../src/modules/permission/entity/permission.entity';
import { PermissionModule } from '../src/modules/permission/permission.module';
import { PermissionService } from '../src/modules/permission/permission.service';
import { UserType } from '../src/modules/user-type/entity/user-type.entity';
import { UserTypeEnum } from '../src/modules/user-type/type/user-type.enum';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserResult } from '../src/modules/user/dto/user-result.dto';
import { User } from '../src/modules/user/entity/user.entity';
import { UserModule } from '../src/modules/user/user.module';
import { UserService } from '../src/modules/user/user.service';
import * as request from 'supertest';
import { getTokenFactory } from './utils/get-token';
import { CreatePermissionDto } from '../src/modules/permission/dto/create-permission.dto';
import { CreatePermissionResponse } from '../src/modules/permission/dto/create-permission-response.dto';
import { FindPermissionDto } from '../src/modules/permission/dto/find-permission.dto';
import { UpdatePermissionResponse } from '../src/modules/permission/dto/update-permission-response.dto';
import { UpdatePermissionDto } from '../src/modules/permission/dto/update-permission.dto';

describe('PermissionController (e2e)', () => {
  let app: INestApplication;
  const basePath = '/permission';
  const userService = {
    findByUsername: jest.fn(),
    comparePassword: jest.fn(),
    find: jest.fn(),
  };
  const permissionService = {
    list: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  let getToken: () => Promise<string>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeOrmModule.forRootAsync(
          typeOrmModuleConfig([User, UserType, Permission]),
        ),
        AuthModule,
        UserModule,
        UserTypeModule,
        PermissionModule,
      ],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .overrideProvider(PermissionService)
      .useValue(permissionService)
      .compile();

    app = moduleFixture.createNestApplication();
    getToken = getTokenFactory(app, userService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/', () => {
    describe('GET', () => {
      it(`${HttpStatus.UNAUTHORIZED}`, () => {
        return request(app.getHttpServer())
          .get(basePath)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      describe('FORBIDDEN', () => {
        let token: string;

        const user: UserResult = {
          id: '1',
          name: 'test',
          type: UserTypeEnum.DEFAULT,
          username: 'test',
        };

        beforeAll(async () => {
          userService.find.mockResolvedValueOnce(user);
          token = await getToken();
        });

        it(`${HttpStatus.FORBIDDEN}`, () => {
          return request(app.getHttpServer())
            .get(basePath)
            .set('authorization', token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe('OK', () => {
        let token: string;
        const user: UserResult = {
          id: '1',
          name: 'test',
          type: UserTypeEnum.ADMIN,
          username: 'test',
        };

        const permissionList = [
          {
            id: 0,
            description: 'test',
          },
        ];

        beforeAll(async () => {
          userService.find.mockResolvedValueOnce(user);
          permissionService.list.mockResolvedValueOnce(permissionList);
          token = await getToken();
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(basePath)
            .set('authorization', token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toStrictEqual(permissionList);
            });
        });
      });
    });

    describe('POST', () => {
      it(`${HttpStatus.UNAUTHORIZED}`, () => {
        return request(app.getHttpServer())
          .post(basePath)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      describe('FORBIDDEN', () => {
        let token: string;

        const user: UserResult = {
          id: '1',
          name: 'test',
          type: UserTypeEnum.DEFAULT,
          username: 'test',
        };

        beforeAll(async () => {
          userService.find.mockResolvedValueOnce(user);
          token = await getToken();
        });

        it(`${HttpStatus.FORBIDDEN}`, () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set('authorization', token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe('OK', () => {
        let token: string;
        const user: UserResult = {
          id: '1',
          name: 'test',
          type: UserTypeEnum.ADMIN,
          username: 'test',
        };

        const createPermissionDto: CreatePermissionDto = {
          description: 'test',
        };

        const permissionResult = CreatePermissionResponse.from({
          id: 0,
          description: createPermissionDto.description,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        });

        beforeAll(async () => {
          permissionService.create.mockResolvedValueOnce(permissionResult);
          token = await getToken();
        });

        beforeEach(() => {
          userService.find.mockResolvedValueOnce(user);
        });

        it(`${HttpStatus.CREATED}`, () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set('authorization', token)
            .send(createPermissionDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toStrictEqual(permissionResult);
            });
        });
      });

      describe('BAD_REQUEST', () => {
        let token: string;
        const user: UserResult = {
          id: '1',
          name: 'test',
          type: UserTypeEnum.ADMIN,
          username: 'test',
        };

        beforeAll(async () => {
          token = await getToken();
          userService.find.mockResolvedValueOnce(user);
        });

        it(`${HttpStatus.BAD_REQUEST}`, () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set('authorization', token)
            .expect(HttpStatus.BAD_REQUEST);
        });
      });
    });
  });

  describe('/:permissionId', () => {
    const permissionId = 1;
    const path = `${basePath}/${permissionId}`;

    describe('GET', () => {
      it(`${HttpStatus.UNAUTHORIZED}`, () => {
        return request(app.getHttpServer())
          .get(path)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      describe('FORBIDDEN', () => {
        let token: string;

        const user: UserResult = {
          id: '1',
          name: 'test',
          type: UserTypeEnum.DEFAULT,
          username: 'test',
        };

        beforeAll(async () => {
          userService.find.mockResolvedValueOnce(user);
          token = await getToken();
        });

        it(`${HttpStatus.FORBIDDEN}`, () => {
          return request(app.getHttpServer())
            .get(path)
            .set('authorization', token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe('OK', () => {
        let token: string;
        const user: UserResult = {
          id: '1',
          name: 'test',
          type: UserTypeEnum.ADMIN,
          username: 'test',
        };
        const permissionExpected = FindPermissionDto.from({
          id: permissionId,
          description: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        });

        beforeAll(async () => {
          permissionService.find.mockResolvedValueOnce(permissionExpected);
          userService.find.mockResolvedValueOnce(user);
          token = await getToken();
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(path)
            .set('authorization', token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', permissionExpected.id);
              expect(response.body).toHaveProperty(
                'description',
                permissionExpected.description,
              );
              expect(response.body).toHaveProperty('createdAt');
            });
        });
      });
    });

    describe('PUT', () => {
      it(`${HttpStatus.UNAUTHORIZED}`, () => {
        return request(app.getHttpServer())
          .put(path)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      describe('FORBIDDEN', () => {
        let token: string;

        const user: UserResult = {
          id: '1',
          name: 'test',
          type: UserTypeEnum.DEFAULT,
          username: 'test',
        };

        beforeAll(async () => {
          userService.find.mockResolvedValueOnce(user);
          token = await getToken();
        });

        it(`${HttpStatus.FORBIDDEN}`, () => {
          return request(app.getHttpServer())
            .put(path)
            .set('authorization', token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe('BAD_REQUEST', () => {
        let token: string;

        const user: UserResult = {
          id: '1',
          name: 'test',
          type: UserTypeEnum.ADMIN,
          username: 'test',
        };

        beforeAll(async () => {
          userService.find.mockResolvedValueOnce(user);
          token = await getToken();
        });

        it(`${HttpStatus.BAD_REQUEST}`, () => {
          return request(app.getHttpServer())
            .put(path)
            .set('authorization', token)
            .expect(HttpStatus.BAD_REQUEST);
        });
      });

      describe('OK', () => {
        let token: string;

        const user: UserResult = {
          id: '1',
          name: 'test',
          type: UserTypeEnum.ADMIN,
          username: 'test',
        };

        const permissionExpected = UpdatePermissionResponse.from({
          id: 1,
          description: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        });

        const updatePermissionDto: UpdatePermissionDto = {
          description: 'test',
        };

        beforeAll(async () => {
          permissionService.update.mockResolvedValueOnce(permissionExpected);
          userService.find.mockResolvedValueOnce(user);
          token = await getToken();
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .put(path)
            .set('authorization', token)
            .send(updatePermissionDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', permissionExpected.id);
              expect(response.body).toHaveProperty(
                'description',
                permissionExpected.description,
              );
              expect(response.body).toHaveProperty('createdAt');
              expect(response.body).toHaveProperty('updatedAt');
            });
        });
      });
    });

    describe('DELETE', () => {
      it(`${HttpStatus.UNAUTHORIZED}`, () => {
        return request(app.getHttpServer())
          .delete(path)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      describe('FORBIDDEN', () => {
        let token: string;

        const user: UserResult = {
          id: '1',
          name: 'test',
          type: UserTypeEnum.DEFAULT,
          username: 'test',
        };

        beforeAll(async () => {
          userService.find.mockResolvedValueOnce(user);
          token = await getToken();
        });

        it(`${HttpStatus.FORBIDDEN}`, () => {
          return request(app.getHttpServer())
            .delete(path)
            .set('authorization', token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe('OK', () => {
        let token: string;

        const user: UserResult = {
          id: '1',
          name: 'test',
          type: UserTypeEnum.ADMIN,
          username: 'test',
        };

        beforeAll(async () => {
          permissionService.delete.mockResolvedValueOnce(true);
          userService.find.mockResolvedValueOnce(user);
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
    });
  });
});
