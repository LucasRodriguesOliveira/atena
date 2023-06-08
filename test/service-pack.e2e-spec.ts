import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { ServicePack } from '../src/modules/service-pack/service-pack/entity/service-pack.entity';
import { ServicePackModule } from '../src/modules/service-pack/service-pack.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { CreateServicePackDto } from '../src/modules/service-pack/service-pack/dto/create-service-pack.dto';
import { CreateServicePackResponseDto } from '../src/modules/service-pack/service-pack/dto/create-service-pack-response.dto';
import { UpdateServicePackDto } from '../src/modules/service-pack/service-pack/dto/update-service-pack.dto';
import { ServicePackController } from '../src/modules/service-pack/service-pack/service-pack.controller';
import { createServicePack } from './utils/create/create-service-pack';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { RepositoryManager } from './utils/repository';
import { RepositoryItem } from './utils/repository/repository-item';
import { CoinController } from '../src/modules/coin/coin.controller';
import { createCoin } from './utils/create/create-coin';
import { randomUUID } from 'crypto';
import { Coin } from '../src/modules/coin/entity/coin.entity';
import { CoinModule } from '../src/modules/coin/coin.module';

describe('ServicePackController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/service-pack';
  const headers = {
    auth: 'authorization',
  };

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
        UserTypeModule,
        ServicePackModule,
        CoinModule,
      ],
    }).compile();

    servicePackController = moduleFixture.get<ServicePackController>(
      ServicePackController,
    );
    coinController = moduleFixture.get<CoinController>(CoinController);

    repositoryManager = new RepositoryManager(moduleFixture);
    repositoryManager.add([
      new RepositoryItem(ServicePack),
      new RepositoryItem(Coin),
    ]);

    app = moduleFixture.createNestApplication();
    await app.init();

    getToken = await getTokenFactory({
      testingModule: moduleFixture,
      testName: 'ServicePack.e2e',
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
        let createServicePackResponse: CreateServicePackResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createServicePackResponse = await createServicePack({
            servicePackController,
            coinController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServicePack.name, {
            id: createServicePackResponse.id,
          });
        });

        it('should return a list of servicePacks', () => {
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

        const createServicePackDto: CreateServicePackDto = {
          name: 'TEST_COIN',
          description: 'TEST_COIN',
          duration: 1,
          lateFee: 1,
          monthlyFee: 1,
          monthlyPayment: 1,
          subscriptionPrice: 1,
          coinId: 0,
        };

        let servicePackId: number;

        beforeAll(async () => {
          token = await getToken.admin();
          const { id } = await createCoin({ coinController });
          createServicePackDto.coinId = id;
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServicePack.name, {
            id: servicePackId,
          });
        });

        it('should create a servicePack', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .send(createServicePackDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('id');

              servicePackId = response.body.id;
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

  describe('/:servicePackId', () => {
    const path = `${basePath}/:servicePackId`;
    const pathTo = (servicePackId: string) =>
      path.replace(/:servicePackId/, servicePackId);

    describe('(GET)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow access to the route without a jwt token', () => {
          return request(app.getHttpServer())
            .get(pathTo(randomUUID()))
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
            .get(pathTo(randomUUID()))
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;
        let createServicePackResponse: CreateServicePackResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createServicePackResponse = await createServicePack({
            servicePackController,
            coinController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServicePack.name, {
            id: createServicePackResponse.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(pathTo(createServicePackResponse.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'id',
                createServicePackResponse.id,
              );
              expect(response.body).toHaveProperty(
                'description',
                createServicePackResponse.description,
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
            .put(pathTo(randomUUID()))
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
            .put(pathTo(randomUUID()))
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;

        const updateServicePackDto: UpdateServicePackDto = {
          description: 'test',
        };

        let servicePack: CreateServicePackResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          servicePack = await createServicePack({
            servicePackController,
            coinController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServicePack.name, {
            id: servicePack.id,
          });
        });

        it('should update a servicePack', () => {
          return request(app.getHttpServer())
            .put(pathTo(servicePack.id))
            .set(headers.auth, token)
            .send(updateServicePackDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              console.log(response.body);
              expect(response.body).toHaveProperty('id', servicePack.id);
              expect(response.body).toHaveProperty(
                'description',
                updateServicePackDto.description,
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
            .delete(pathTo(randomUUID()))
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
            .delete(pathTo(randomUUID()))
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;
        let servicePack: CreateServicePackResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          servicePack = await createServicePack({
            servicePackController,
            coinController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(ServicePack.name, {
            id: servicePack.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .delete(pathTo(servicePack.id))
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
