import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { ServicePackItemType } from '../src/modules/service-pack-item-type/entity/service-pack-item-type.entity';
import { ServicePackItemTypeModule } from '../src/modules/service-pack-item-type/service-pack-item-type.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { CreateServicePackItemTypeDto } from '../src/modules/service-pack-item-type/dto/create-service-pack-item-type.dto';
import { CreateServicePackItemTypeResponseDto } from '../src/modules/service-pack-item-type/dto/create-service-pack-item-type-response.dto';
import { UpdateServicePackItemTypeDto } from '../src/modules/service-pack-item-type/dto/update-service-pack-item-type.dto';
import { ServicePackItemTypeController } from '../src/modules/service-pack-item-type/service-pack-item-type.controller';
import { createServicePackItemType } from './utils/create/create-service-pack-item-type';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { RepositoryManager } from './utils/repository';
import { RepositoryItem } from './utils/repository/repository-item';

describe('ServicePackItemTypeController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/service-pack/item-type';
  const headers = {
    auth: 'authorization',
  };

  let servicePackItemTypeController: ServicePackItemTypeController;

  let repositoryManager: RepositoryManager;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
        UserModule,
        UserTypeModule,
        ServicePackItemTypeModule,
      ],
    }).compile();

    servicePackItemTypeController =
      moduleFixture.get<ServicePackItemTypeController>(
        ServicePackItemTypeController,
      );
    repositoryManager = new RepositoryManager(moduleFixture);
    repositoryManager.add([new RepositoryItem(ServicePackItemType)]);

    app = moduleFixture.createNestApplication();
    await app.init();

    getToken = await getTokenFactory({
      testingModule: moduleFixture,
      testName: 'SP-ItemType.e2e',
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
        let createServicePackItemTypeResponse: CreateServicePackItemTypeResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createServicePackItemTypeResponse = await createServicePackItemType({
            servicePackItemTypeController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServicePackItemType.name, {
            id: createServicePackItemTypeResponse.id,
          });
        });

        it('should return a list of servicePackItemTypes', () => {
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

        const createServicePackItemTypeDto: CreateServicePackItemTypeDto = {
          description: 'test',
        };

        let servicePackItemTypeId: number;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServicePackItemType.name, {
            id: servicePackItemTypeId,
          });
        });

        it('should create a servicePackItemType', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .send(createServicePackItemTypeDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('id');

              servicePackItemTypeId = response.body.id;
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

  describe('/:servicePackItemTypeId', () => {
    const path = `${basePath}/:servicePackItemTypeId`;
    const pathTo = (servicePackItemTypeId: number) =>
      path.replace(/:servicePackItemTypeId/, `${servicePackItemTypeId}`);

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
        let createServicePackItemTypeResponse: CreateServicePackItemTypeResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createServicePackItemTypeResponse = await createServicePackItemType({
            servicePackItemTypeController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServicePackItemType.name, {
            id: createServicePackItemTypeResponse.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(pathTo(createServicePackItemTypeResponse.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'id',
                createServicePackItemTypeResponse.id,
              );
              expect(response.body).toHaveProperty(
                'description',
                createServicePackItemTypeResponse.description,
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

        const updateServicePackItemTypeDto: UpdateServicePackItemTypeDto = {
          description: 'test',
        };

        let servicePackItemType: CreateServicePackItemTypeResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          servicePackItemType = await createServicePackItemType({
            servicePackItemTypeController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServicePackItemType.name, {
            id: servicePackItemType.id,
          });
        });

        it('should update a servicePackItemType', () => {
          return request(app.getHttpServer())
            .put(pathTo(servicePackItemType.id))
            .set(headers.auth, token)
            .send(updateServicePackItemTypeDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'id',
                servicePackItemType.id,
              );
              expect(response.body).toHaveProperty(
                'description',
                updateServicePackItemTypeDto.description,
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
        let servicePackItemType: CreateServicePackItemTypeResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          servicePackItemType = await createServicePackItemType({
            servicePackItemTypeController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServicePackItemType.name, {
            id: servicePackItemType.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .delete(pathTo(servicePackItemType.id))
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
