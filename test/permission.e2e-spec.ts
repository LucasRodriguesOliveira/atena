import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { Permission } from '../src/modules/permission/entity/permission.entity';
import { PermissionModule } from '../src/modules/permission/permission.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { CreatePermissionDto } from '../src/modules/permission/dto/create-permission.dto';
import { CreatePermissionResponse } from '../src/modules/permission/dto/create-permission-response.dto';
import { UpdatePermissionDto } from '../src/modules/permission/dto/update-permission.dto';
import { PermissionController } from '../src/modules/permission/permission.controller';
import { addRepository } from './utils/repository';
import { createPermission } from './utils/create/create-permission';
import { removeAndCheck } from './utils/remove-and-check';
import { removePermission } from './utils/remove/remove-permission';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';

describe('PermissionController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/permission';
  const headers = {
    auth: 'authorization',
  };

  let permissionController: PermissionController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
        UserModule,
        UserTypeModule,
        PermissionModule,
      ],
    }).compile();

    permissionController =
      moduleFixture.get<PermissionController>(PermissionController);

    addRepository({
      testingModule: moduleFixture,
      name: [Permission.name],
    });

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
        let createPermissionResponse: CreatePermissionResponse;

        beforeAll(async () => {
          token = await getToken.admin();
          createPermissionResponse = await createPermission({
            permissionController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Permission (${createPermissionResponse.id})`,
            removeFunction: async () =>
              removePermission({ id: createPermissionResponse.id }),
          });
        });

        it('should return a list of permissions', () => {
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

        const createPermissionDto: CreatePermissionDto = {
          description: 'test',
        };

        let permissionId: number;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Permission (${permissionId})`,
            removeFunction: async () => removePermission({ id: permissionId }),
          });
        });

        it('should create a permission', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .send(createPermissionDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('id');

              permissionId = response.body.id;
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

  describe('/:permissionId', () => {
    const path = `${basePath}/:permissionId`;
    const pathTo = (permissionId: number) =>
      path.replace(/:permissionId/, `${permissionId}`);

    describe('(GET)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow access to the route without a jwt token', () => {
          return request(app.getHttpServer())
            .get(pathTo(-1))
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
            .get(pathTo(-1))
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;
        let createPermissionResponse: CreatePermissionResponse;

        beforeAll(async () => {
          token = await getToken.admin();
          createPermissionResponse = await createPermission({
            permissionController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Permission (${createPermissionResponse.id})`,
            removeFunction: async () =>
              removePermission({ id: createPermissionResponse.id }),
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(pathTo(createPermissionResponse.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'id',
                createPermissionResponse.id,
              );
              expect(response.body).toHaveProperty(
                'description',
                createPermissionResponse.description,
              );
              expect(response.body).toHaveProperty('createdAt');
            });
        });
      });
    });

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

        const updatePermissionDto: UpdatePermissionDto = {
          description: 'test',
        };

        let permission: CreatePermissionResponse;

        beforeAll(async () => {
          token = await getToken.admin();
          permission = await createPermission({
            permissionController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Permission (${permission.id})`,
            removeFunction: async () => removePermission({ id: permission.id }),
          });
        });

        it('should update a permission', () => {
          return request(app.getHttpServer())
            .put(pathTo(permission.id))
            .set(headers.auth, token)
            .send(updatePermissionDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', permission.id);
              expect(response.body).toHaveProperty(
                'description',
                updatePermissionDto.description,
              );
              expect(response.body).toHaveProperty('createdAt');
              expect(response.body).toHaveProperty('updatedAt');
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
        let permission: CreatePermissionResponse;

        beforeAll(async () => {
          token = await getToken.admin();
          permission = await createPermission({
            permissionController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Permission (${permission.id})`,
            removeFunction: async () => removePermission({ id: permission.id }),
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .delete(pathTo(permission.id))
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
