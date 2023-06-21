import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { ServiceStage } from '../src/modules/service-stage/entity/service-stage.entity';
import { ServiceStageModule } from '../src/modules/service-stage/service-stage.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { CreateServiceStageDto } from '../src/modules/service-stage/dto/create-service-stage.dto';
import { CreateServiceStageResponseDto } from '../src/modules/service-stage/dto/create-service-stage-response.dto';
import { UpdateServiceStageDto } from '../src/modules/service-stage/dto/update-service-stage.dto';
import { ServiceStageController } from '../src/modules/service-stage/service-stage.controller';
import { createServiceStage } from './utils/create/create-service-stage';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { RepositoryManager } from './utils/repository';
import { RepositoryItem } from './utils/repository/repository-item';

describe('ServiceStageController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/service-stage';
  const headers = {
    auth: 'authorization',
  };

  let serviceStageController: ServiceStageController;

  let repositoryManager: RepositoryManager;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
        UserModule,
        UserTypeModule,
        ServiceStageModule,
      ],
    }).compile();

    serviceStageController = moduleFixture.get<ServiceStageController>(
      ServiceStageController,
    );

    repositoryManager = new RepositoryManager(moduleFixture);
    repositoryManager.add([new RepositoryItem(ServiceStage)]);

    app = moduleFixture.createNestApplication();
    await app.init();

    getToken = await getTokenFactory({
      testingModule: moduleFixture,
      testName: 'ServiceStage.e2e',
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
        let createServiceStageResponse: CreateServiceStageResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createServiceStageResponse = await createServiceStage({
            serviceStageController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServiceStage.name, {
            id: createServiceStageResponse.id,
          });
        });

        it('should return a list of serviceStages', () => {
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

        const createServiceStageDto: CreateServiceStageDto = {
          description: 'test',
        };

        let serviceStageId: number;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServiceStage.name, {
            id: serviceStageId,
          });
        });

        it('should create a serviceStage', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .send(createServiceStageDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('id');

              serviceStageId = response.body.id;
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

  describe('/:serviceStageId', () => {
    const path = `${basePath}/:serviceStageId`;
    const pathTo = (serviceStageId: number) =>
      path.replace(/:serviceStageId/, `${serviceStageId}`);

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
        let createServiceStageResponse: CreateServiceStageResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createServiceStageResponse = await createServiceStage({
            serviceStageController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServiceStage.name, {
            id: createServiceStageResponse.id,
          });
        });

        it('should find successfully a service stage by id', () => {
          return request(app.getHttpServer())
            .get(pathTo(createServiceStageResponse.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'id',
                createServiceStageResponse.id,
              );
              expect(response.body).toHaveProperty(
                'description',
                createServiceStageResponse.description,
              );
              expect(response.body).toHaveProperty('createdAt');
            });
        });
      });

      describe(`NOT_FOUND - ${HttpStatus.NOT_FOUND}`, () => {
        let token: string;
        const serviceStageId = -1;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        it('should not find a service stage', () => {
          return request(app.getHttpServer())
            .get(pathTo(serviceStageId))
            .set(headers.auth, token)
            .expect(HttpStatus.NOT_FOUND);
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

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;

        const updateServiceStageDto: UpdateServiceStageDto = {
          description: 'test',
        };

        let serviceStage: CreateServiceStageResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          serviceStage = await createServiceStage({
            serviceStageController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServiceStage.name, {
            id: serviceStage.id,
          });
        });

        it('should update a serviceStage', () => {
          return request(app.getHttpServer())
            .put(pathTo(serviceStage.id))
            .set(headers.auth, token)
            .send(updateServiceStageDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', serviceStage.id);
              expect(response.body).toHaveProperty(
                'description',
                updateServiceStageDto.description,
              );
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
        let serviceStage: CreateServiceStageResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          serviceStage = await createServiceStage({
            serviceStageController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServiceStage.name, {
            id: serviceStage.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .delete(pathTo(serviceStage.id))
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
