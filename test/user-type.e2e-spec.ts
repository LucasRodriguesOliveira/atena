import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envConfig } from '../src/config/env/env.config';
import { typeOrmModuleConfig } from '../src/config/typeorm/typeorm-module.config';
import { UserType } from '../src/modules/user-type/entity/user-type.entity';
import { UserTypeEnum } from '../src/modules/user-type/type/user-type.enum';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserTypeService } from '../src/modules/user-type/user-type.service';
import { UserResult } from '../src/modules/user/dto/user-result.dto';
import { User } from '../src/modules/user/entity/user.entity';
import * as request from 'supertest';
import { AuthModule } from '../src/modules/auth/auth.module';
import { UserModule } from '../src/modules/user/user.module';
import { UserService } from '../src/modules/user/user.service';
import { CreateUserTypeDto } from '../src/modules/user-type/dto/create-user-type.dto';
import { CreateUserTypeResponse } from '../src/modules/user-type/dto/create-user-type-response.dto';
import { UpdateUserTypeDto } from '../src/modules/user-type/dto/update-user-type.dto';
import { UpdateUserTypeResponse } from '../src/modules/user-type/dto/update-user-type-response.dto';
import { getTokenFactory } from './utils/get-token';

describe('UserTypeController (e2e)', () => {
  let app: INestApplication;
  const basePath = '/user-type';
  const userService = {
    findByUsername: jest.fn(),
    find: jest.fn(),
    hashPassword: jest.fn((password) => password),
    comparePassword: jest.fn(),
  };
  const userTypeService = {
    list: jest.fn(),
    create: jest.fn(),
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
        UserTypeModule,
      ],
    })
      .overrideProvider(UserTypeService)
      .useValue(userTypeService)
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
    describe('GET', () => {
      const userTypeList: Partial<UserType>[] = [
        {
          id: 0,
          description: 'ADMIN',
        },
        {
          id: 1,
          description: 'DEFAULT',
        },
      ];

      it(`${HttpStatus.UNAUTHORIZED}`, () => {
        return request(app.getHttpServer())
          .get(basePath)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      describe('FORBIDDEN', () => {
        let token: string;
        const userResult: UserResult = {
          id: '0',
          type: UserTypeEnum.DEFAULT,
          name: 'test',
          username: 'test.test',
        };

        beforeAll(async () => {
          userService.find.mockResolvedValueOnce(userResult);
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
        const userResult: UserResult = {
          id: '0',
          type: UserTypeEnum.ADMIN,
          name: 'test',
          username: 'test.test',
        };

        beforeAll(async () => {
          userService.find.mockResolvedValueOnce(userResult);
          userTypeService.list.mockResolvedValueOnce(userTypeList);
          token = await getToken();
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(basePath)
            .set('authorization', token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toStrictEqual(userTypeList);
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
        const userResult: UserResult = {
          id: '0',
          type: UserTypeEnum.DEFAULT,
          name: 'test',
          username: 'test.test',
        };

        beforeAll(async () => {
          userService.find.mockResolvedValueOnce(userResult);
          token = await getToken();
        });

        it(`${HttpStatus.FORBIDDEN}`, () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set('authorization', token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe('CREATED', () => {
        let token: string;
        const userResult: UserResult = {
          id: '0',
          type: UserTypeEnum.ADMIN,
          name: 'test',
          username: 'test.test',
        };
        const createUserType: CreateUserTypeDto = {
          description: 'new user type',
        };

        const userType: UserType = {
          id: 0,
          description: createUserType.description,
          createdAt: null,
          deletedAt: null,
          updatedAt: null,
          users: [],
        };

        beforeAll(async () => {
          userService.find.mockResolvedValueOnce(userResult);
          userTypeService.create.mockResolvedValueOnce(userType);
          token = await getToken();
        });

        it(`${HttpStatus.CREATED}`, () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set('authorization', token)
            .send(createUserType)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toStrictEqual(
                CreateUserTypeResponse.from(userType),
              );
            });
        });
      });

      describe('BAD_REQUEST', () => {
        let token: string;
        const userResult: UserResult = {
          id: '0',
          type: UserTypeEnum.ADMIN,
          name: 'test',
          username: 'test.test',
        };

        beforeAll(async () => {
          userService.find.mockResolvedValueOnce(userResult);
          token = await getToken();
        });

        it(`${HttpStatus.BAD_REQUEST}`, () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set('authorization', token)
            .expect(HttpStatus.BAD_REQUEST);
        });
      });
    });

    describe('/:userTypeId', () => {
      const userTypeId = 1;
      const path = `${basePath}/${userTypeId}`;

      describe('PUT', () => {
        it(`${HttpStatus.UNAUTHORIZED}`, () => {
          return request(app.getHttpServer())
            .put(path)
            .expect(HttpStatus.UNAUTHORIZED);
        });

        describe('FORBIDDEN', () => {
          let token: string;
          const userResult: UserResult = {
            id: '0',
            type: UserTypeEnum.DEFAULT,
            name: 'test',
            username: 'test.test',
          };

          beforeAll(async () => {
            userService.find.mockResolvedValueOnce(userResult);
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
          const userResult: UserResult = {
            id: '0',
            type: UserTypeEnum.ADMIN,
            name: 'test',
            username: 'test.test',
          };

          beforeAll(async () => {
            userService.find.mockResolvedValueOnce(userResult);
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
          const updateUserType: UpdateUserTypeDto = {
            description: 'update user type description',
          };
          let token: string;
          const userType: UserType = {
            id: 0,
            description: updateUserType.description,
            createdAt: null,
            deletedAt: null,
            updatedAt: null,
            users: [],
          };
          const userResult: UserResult = {
            id: '0',
            type: UserTypeEnum.ADMIN,
            name: 'test',
            username: 'test.test',
          };

          beforeAll(async () => {
            userService.find.mockResolvedValue(userResult);
            userTypeService.update.mockResolvedValueOnce(userType);
            token = await getToken();
          });

          it(`${HttpStatus.OK}`, () => {
            return request(app.getHttpServer())
              .put(path)
              .set('authorization', token)
              .send(updateUserType)
              .expect(HttpStatus.OK)
              .then((response) => {
                expect(response.body).toStrictEqual(
                  UpdateUserTypeResponse.from(userType),
                );
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
          const userResult: UserResult = {
            id: '0',
            type: UserTypeEnum.DEFAULT,
            name: 'test',
            username: 'test.test',
          };
          beforeAll(async () => {
            userService.find.mockResolvedValue(userResult);
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
          const userResult: UserResult = {
            id: '0',
            type: UserTypeEnum.ADMIN,
            name: 'test',
            username: 'test.test',
          };

          beforeAll(async () => {
            userService.find.mockResolvedValueOnce(userResult);
            userTypeService.delete.mockResolvedValueOnce(true);
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
});
