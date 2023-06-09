import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { createServicePackItemType } from './utils/create/create-service-pack-item-type';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { RepositoryManager } from './utils/repository';
import { RepositoryItem } from './utils/repository/repository-item';
import { ServicePackItem } from '../src/modules/service-pack/item/entity/service-pack-item.entity';
import { ServicePackItemController } from '../src/modules/service-pack/item/service-pack-item.controller';
import { ServicePackItemTypeController } from '../src/modules/service-pack/item-type/service-pack-item-type.controller';
import { ServicePackController } from '../src/modules/service-pack/service/service-pack.controller';
import { CoinController } from '../src/modules/coin/coin.controller';
import { CreateServicePackItemResponseDto } from '../src/modules/service-pack/item/dto/create-service-pack-item-response.dto';
import { createServicePackItem } from './utils/create/create-service-pack-item';
import { CreateServicePackItemDto } from '../src/modules/service-pack/item/dto/create-service-pack-item.dto';
import { createServicePack } from './utils/create/create-service-pack';
import { UpdateServicePackItemDto } from '../src/modules/service-pack/item/dto/update-service-pack-item.dto';
import { ServicePack } from '../src/modules/service-pack/service/entity/service-pack.entity';
import { ServicePackItemType } from '../src/modules/service-pack/item-type/entity/service-pack-item-type.entity';
import { ServicePackModule } from '../src/modules/service-pack/service-pack.module';
import { ServicePackItemModule } from '../src/modules/service-pack/item/service-pack-item.module';
import { ServicePackItemTypeModule } from '../src/modules/service-pack/item-type/service-pack-item-type.module';
import { CoinModule } from '../src/modules/coin/coin.module';

describe('ServicePackItemController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/service-pack/item';
  const headers = {
    auth: 'authorization',
  };

  let servicePackItemController: ServicePackItemController;
  let servicePackItemTypeController: ServicePackItemTypeController;
  let servicePackController: ServicePackController;
  let coinController: CoinController;

  let repositoryManager: RepositoryManager;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
        UserModule,
        CoinModule,
        UserTypeModule,
        ServicePackModule,
        ServicePackItemModule,
        ServicePackItemTypeModule,
      ],
    }).compile();

    servicePackItemController = moduleFixture.get<ServicePackItemController>(
      ServicePackItemController,
    );
    servicePackItemTypeController =
      moduleFixture.get<ServicePackItemTypeController>(
        ServicePackItemTypeController,
      );
    servicePackController = moduleFixture.get<ServicePackController>(
      ServicePackController,
    );
    coinController = moduleFixture.get<CoinController>(CoinController);

    repositoryManager = new RepositoryManager(moduleFixture);
    repositoryManager.add([
      new RepositoryItem(ServicePackItem),
      new RepositoryItem(ServicePack),
      new RepositoryItem(ServicePackItemType),
    ]);

    app = moduleFixture.createNestApplication();
    await app.init();

    getToken = await getTokenFactory({
      testingModule: moduleFixture,
      testName: 'ServicePackItem.e2e',
    });
  });

  afterAll(async () => {
    await getToken.clear();
    await app.close();
  });

  describe('/', () => {
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

        const createServicePackItemDto: CreateServicePackItemDto = {
          amount: 1,
          itemTypeId: 0,
          servicePackId: '',
        };

        let servicePackItemId: number;

        beforeAll(async () => {
          token = await getToken.admin();
          const [servicePack, itemType] = await Promise.all([
            createServicePack({
              servicePackController,
              coinController,
            }),
            createServicePackItemType({
              servicePackItemTypeController,
            }),
          ]);

          createServicePackItemDto.itemTypeId = itemType.id;
          createServicePackItemDto.servicePackId = servicePack.id;
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServicePackItem.name, {
            id: servicePackItemId,
          });
        });

        it('should create a servicePackItemType', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .send(createServicePackItemDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('id');

              servicePackItemId = response.body.id;
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

  describe('/:servicePackItemId', () => {
    const path = `${basePath}/:servicePackItemId`;
    const pathTo = (servicePackItemId: number) =>
      path.replace(/:servicePackItemId/, `${servicePackItemId}`);

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
        let createServicePackItemResponse: CreateServicePackItemResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createServicePackItemResponse = await createServicePackItem({
            servicePackItemTypeController,
            servicePackController,
            servicePackItemController,
            coinController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServicePackItem.name, {
            id: createServicePackItemResponse.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(pathTo(createServicePackItemResponse.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'id',
                createServicePackItemResponse.id,
              );
              expect(response.body).toHaveProperty(
                'amount',
                createServicePackItemResponse.amount,
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

        const updateServicePackItemDto: UpdateServicePackItemDto = {
          amount: 1,
        };

        let servicePackItem: CreateServicePackItemResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          servicePackItem = await createServicePackItem({
            servicePackItemTypeController,
            servicePackController,
            servicePackItemController,
            coinController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServicePackItem.name, {
            id: servicePackItem.id,
          });
        });

        it('should update a servicePackItem', () => {
          return request(app.getHttpServer())
            .put(pathTo(servicePackItem.id))
            .set(headers.auth, token)
            .send(updateServicePackItemDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', servicePackItem.id);
              expect(response.body).toHaveProperty(
                'amount',
                updateServicePackItemDto.amount,
              );
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
        let servicePackItem: CreateServicePackItemResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          servicePackItem = await createServicePackItem({
            servicePackItemTypeController,
            servicePackController,
            servicePackItemController,
            coinController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServicePack.name, {
            id: servicePackItem.servicePack.id,
          });
          await repositoryManager.removeAndCheck(ServicePackItemType.name, {
            id: servicePackItem.itemType.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .delete(pathTo(servicePackItem.id))
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
