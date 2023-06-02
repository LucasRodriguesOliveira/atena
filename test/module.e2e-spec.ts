import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envConfig } from '../src/config/env/env.config';
import { typeOrmModuleConfig } from '../src/config/typeorm/typeorm-module.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { UserType } from '../src/modules/user-type/entity/user-type.entity';
import { UserTypeEnum } from '../src/modules/user-type/type/user-type.enum';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserResult } from '../src/modules/user/dto/user-result.dto';
import { User } from '../src/modules/user/entity/user.entity';
import { UserModule } from '../src/modules/user/user.module';
import { UserService } from '../src/modules/user/user.service';
import * as request from 'supertest';
import { getTokenFactory } from './utils/get-token';
import { ModuleModule } from '../src/modules/module/module.module';
import { ModuleService } from '../src/modules/module/module.service';
import { CreateModuleDto } from '../src/modules/module/dto/create-module.dto';
import { CreateModuleResponse } from '../src/modules/module/dto/create-module-response.dto';
import { FindModuleDto } from '../src/modules/module/dto/find-module.dto';
import { UpdateModuleResponse } from '../src/modules/module/dto/update-module-response.dto';
import { UpdateModuleDto } from '../src/modules/module/dto/update-module.dto';
import { Module } from '../src/modules/module/entity/module.entity';

describe('ModuleController (e2e)', () => {
  let app: INestApplication;
  const basePath = '/module';
  const userService = {
    findByUsername: jest.fn(),
    comparePassword: jest.fn(),
    find: jest.fn(),
  };
  const moduleService = {
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
          typeOrmModuleConfig([User, UserType, Module]),
        ),
        AuthModule,
        UserModule,
        UserTypeModule,
        ModuleModule,
      ],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .overrideProvider(ModuleService)
      .useValue(moduleService)
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

        const moduleList = [
          {
            id: 0,
            description: 'test',
          },
        ];

        beforeAll(async () => {
          userService.find.mockResolvedValueOnce(user);
          moduleService.list.mockResolvedValueOnce(moduleList);
          token = await getToken();
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(basePath)
            .set('authorization', token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toStrictEqual(moduleList);
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

        const createModuleDto: CreateModuleDto = {
          description: 'test',
        };

        const moduleResult = CreateModuleResponse.from({
          id: 0,
          description: createModuleDto.description,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        });

        beforeAll(async () => {
          moduleService.create.mockResolvedValueOnce(moduleResult);
          token = await getToken();
        });

        beforeEach(() => {
          userService.find.mockResolvedValueOnce(user);
        });

        it(`${HttpStatus.CREATED}`, () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set('authorization', token)
            .send(createModuleDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toStrictEqual(moduleResult);
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

  describe('/:moduleId', () => {
    const moduleId = 1;
    const path = `${basePath}/${moduleId}`;

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
        const moduleExpected = FindModuleDto.from({
          id: moduleId,
          description: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        });

        beforeAll(async () => {
          moduleService.find.mockResolvedValueOnce(moduleExpected);
          userService.find.mockResolvedValueOnce(user);
          token = await getToken();
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(path)
            .set('authorization', token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', moduleExpected.id);
              expect(response.body).toHaveProperty(
                'description',
                moduleExpected.description,
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

        const moduleExpected = UpdateModuleResponse.from({
          id: 1,
          description: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        });

        const updateModuleDto: UpdateModuleDto = {
          description: moduleExpected.description,
        };

        beforeAll(async () => {
          moduleService.update.mockResolvedValueOnce(moduleExpected);
          userService.find.mockResolvedValueOnce(user);
          token = await getToken();
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .put(path)
            .set('authorization', token)
            .send(updateModuleDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', moduleExpected.id);
              expect(response.body).toHaveProperty(
                'description',
                moduleExpected.description,
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
          moduleService.delete.mockResolvedValueOnce(true);
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
