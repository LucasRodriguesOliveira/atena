import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { Module } from '../src/modules/module/entity/module.entity';
import { ModuleModule } from '../src/modules/module/module.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { CreateModuleDto } from '../src/modules/module/dto/create-module.dto';
import { CreateModuleResponse } from '../src/modules/module/dto/create-module-response.dto';
import { UpdateModuleDto } from '../src/modules/module/dto/update-module.dto';
import { ModuleController } from '../src/modules/module/module.controller';
import { addRepository } from './utils/repository';
import { createModule } from './utils/create/create-module';
import { removeAndCheck } from './utils/remove-and-check';
import { removeModule } from './utils/remove/remove-module';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';

describe('ModuleController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/module';
  const headers = {
    auth: 'authorization',
  };

  let moduleController: ModuleController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
        UserModule,
        UserTypeModule,
        ModuleModule,
      ],
    }).compile();

    moduleController = moduleFixture.get<ModuleController>(ModuleController);

    addRepository({
      testingModule: moduleFixture,
      name: [Module.name],
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
        let createModuleResponse: CreateModuleResponse;

        beforeAll(async () => {
          token = await getToken.admin();
          createModuleResponse = await createModule({
            moduleController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Module (${createModuleResponse.id})`,
            removeFunction: async () =>
              removeModule({ id: createModuleResponse.id }),
          });
        });

        it('should return a list of modules', () => {
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

        const createModuleDto: CreateModuleDto = {
          description: 'test',
        };

        let moduleId: number;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Module (${moduleId})`,
            removeFunction: async () => removeModule({ id: moduleId }),
          });
        });

        it('should create a module', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .send(createModuleDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('id');

              moduleId = response.body.id;
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

  describe('/:moduleId', () => {
    const path = `${basePath}/:moduleId`;
    const pathTo = (moduleId: number) =>
      path.replace(/:moduleId/, `${moduleId}`);

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
        let createModuleResponse: CreateModuleResponse;

        beforeAll(async () => {
          token = await getToken.admin();
          createModuleResponse = await createModule({
            moduleController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Module (${createModuleResponse.id})`,
            removeFunction: async () =>
              removeModule({ id: createModuleResponse.id }),
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(pathTo(createModuleResponse.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'id',
                createModuleResponse.id,
              );
              expect(response.body).toHaveProperty(
                'description',
                createModuleResponse.description,
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

        const updateModuleDto: UpdateModuleDto = {
          description: 'test',
        };

        let module: CreateModuleResponse;

        beforeAll(async () => {
          token = await getToken.admin();
          module = await createModule({
            moduleController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Module (${module.id})`,
            removeFunction: async () => removeModule({ id: module.id }),
          });
        });

        it('should update a module', () => {
          return request(app.getHttpServer())
            .put(pathTo(module.id))
            .set(headers.auth, token)
            .send(updateModuleDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', module.id);
              expect(response.body).toHaveProperty(
                'description',
                updateModuleDto.description,
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
        let module: CreateModuleResponse;

        beforeAll(async () => {
          token = await getToken.admin();
          module = await createModule({
            moduleController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Module (${module.id})`,
            removeFunction: async () => removeModule({ id: module.id }),
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .delete(pathTo(module.id))
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
