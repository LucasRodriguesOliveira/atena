import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { Installment } from '../src/modules/installment/item/entity/installment.entity';
import { InstallmentModule } from '../src/modules/installment/item/installment.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { CreateInstallmentDto } from '../src/modules/installment/item/dto/create-installment.dto';
import { UpdateInstallmentDto } from '../src/modules/installment/item/dto/update-installment.dto';
import { InstallmentController } from '../src/modules/installment/item/installment.controller';
import {
  CreateInstallmentResponse,
  createInstallment,
} from './utils/create/create-installment';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { RepositoryManager } from './utils/repository';
import { RepositoryItem } from './utils/repository/repository-item';
import { QueryInstallmentDto } from '../src/modules/installment/item/dto/query-installment.dto';
import { InstallmentTypeModule } from '../src/modules/installment/type/installment-type.module';
import { PaymentMethodModule } from '../src/modules/payment-method/payment-method.module';
import { ServicePackModule } from '../src/modules/service-pack/service-pack.module';
import { CoinModule } from '../src/modules/coin/coin.module';
import { ContractModule } from '../src/modules/contract/contract.module';
import { ClientModule } from '../src/modules/client/client.module';
import { CompanyModule } from '../src/modules/company/company.module';
import { ServicePack } from '../src/modules/service-pack/service/entity/service-pack.entity';
import { Coin } from '../src/modules/coin/entity/coin.entity';
import { Contract } from '../src/modules/contract/entity/contract.entity';
import { Client } from '../src/modules/client/entity/client.entity';
import { Company } from '../src/modules/company/entity/company.entity';
import { PaymentMethod } from '../src/modules/payment-method/entity/payment-method.entity';
import { InstallmentType } from '../src/modules/installment/type/entity/installment-type.entity';
import { CoinController } from '../src/modules/coin/coin.controller';
import { CompanyController } from '../src/modules/company/company.controller';
import { ContractController } from '../src/modules/contract/contract.controller';
import { InstallmentTypeController } from '../src/modules/installment/type/installment-type.controller';
import { PaymentMethodController } from '../src/modules/payment-method/payment-method.controller';
import { ServicePackController } from '../src/modules/service-pack/service/service-pack.controller';
import { ClientController } from '../src/modules/client/client.controller';
import { createContract } from './utils/create/create-contract';
import { createInstallmentType } from './utils/create/create-installment-type';
import { createPaymentMethod } from './utils/create/create-payment-method';
import { createCoin } from './utils/create/create-coin';
import { randomUUID } from 'crypto';

describe('InstallmentController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/installment/item';
  const headers = {
    auth: 'authorization',
  };
  let repositoryManager: RepositoryManager;

  const controllers = {
    installment: null,
    servicePack: null,
    coin: null,
    company: null,
    contract: null,
    paymentMethod: null,
    installmentType: null,
    client: null,
  };

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
        ContractModule,
        ClientModule,
        CompanyModule,
        PaymentMethodModule,
        InstallmentTypeModule,
        InstallmentModule,
      ],
    }).compile();

    controllers.installment = moduleFixture.get<InstallmentController>(
      InstallmentController,
    );
    controllers.coin = moduleFixture.get<CoinController>(CoinController);
    controllers.company =
      moduleFixture.get<CompanyController>(CompanyController);
    controllers.contract =
      moduleFixture.get<ContractController>(ContractController);
    controllers.installmentType = moduleFixture.get<InstallmentTypeController>(
      InstallmentTypeController,
    );
    controllers.paymentMethod = moduleFixture.get<PaymentMethodController>(
      PaymentMethodController,
    );
    controllers.servicePack = moduleFixture.get<ServicePackController>(
      ServicePackController,
    );
    controllers.client = moduleFixture.get<ClientController>(ClientController);

    repositoryManager = new RepositoryManager(moduleFixture);
    repositoryManager.add([
      new RepositoryItem(Installment),
      new RepositoryItem(ServicePack),
      new RepositoryItem(Coin),
      new RepositoryItem(Contract),
      new RepositoryItem(Client),
      new RepositoryItem(Company),
      new RepositoryItem(PaymentMethod),
      new RepositoryItem(InstallmentType),
    ]);

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
        let createInstallmentResponse: CreateInstallmentResponse;
        let queryInstallmentDto: QueryInstallmentDto = {};

        beforeAll(async () => {
          token = await getToken.admin();
          createInstallmentResponse = await createInstallment({
            installmentController: controllers.installment,
            clientController: controllers.client,
            coinController: controllers.coin,
            companyController: controllers.company,
            contractController: controllers.contract,
            installmentTypeController: controllers.installmentType,
            paymentMethodController: controllers.paymentMethod,
            servicePackController: controllers.servicePack,
          });
          queryInstallmentDto = {
            coinId: createInstallmentResponse.installment.coin.id,
            companyId: createInstallmentResponse.contract.company.id,
            installmentTypeId:
              createInstallmentResponse.installment.installmentType.id,
            servicePackId: createInstallmentResponse.contract.servicePack.id,
          };
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(Installment.name, {
            id: createInstallmentResponse.installment.id,
          });
        });

        it('should return a list of installments', () => {
          return request(app.getHttpServer())
            .get(basePath)
            .set(headers.auth, token)
            .query(queryInstallmentDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('data');
              expect(response.body).toHaveProperty('total');
              expect(response.body.data.length).toBeGreaterThanOrEqual(1);
              expect(response.body.total).toBeGreaterThanOrEqual(1);
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

        let createInstallmentDto: CreateInstallmentDto;

        let installmentId: number;

        beforeAll(async () => {
          token = await getToken.admin();
          const [coin, contract, installmentType, paymentMethod] =
            await Promise.all([
              createCoin({ coinController: controllers.coin }),
              createContract({
                contractController: controllers.contract,
                clientController: controllers.client,
                coinController: controllers.coin,
                companyController: controllers.company,
                servicePackController: controllers.servicePack,
              }),
              createInstallmentType({
                installmentTypeController: controllers.installmentType,
              }),
              createPaymentMethod({
                paymentMethodController: controllers.paymentMethod,
              }),
            ]);

          createInstallmentDto = {
            coinId: coin.id,
            contractId: contract.id,
            paymentMethodId: paymentMethod.id,
            installmentTypeId: installmentType.id,
            expiresAt: new Date(),
            value: 10,
          };
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(Installment.name, {
            id: installmentId,
          });
        });

        it('should create a installment', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .send(createInstallmentDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('id');

              installmentId = response.body.id;
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

  describe('/:installmentId', () => {
    const path = `${basePath}/:installmentId`;
    const pathTo = (installmentId: string) =>
      path.replace(/:installmentId/, installmentId);

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
        let createInstallmentResponse: CreateInstallmentResponse;

        beforeAll(async () => {
          token = await getToken.admin();
          createInstallmentResponse = await createInstallment({
            installmentController: controllers.installment,
            clientController: controllers.client,
            coinController: controllers.coin,
            companyController: controllers.company,
            contractController: controllers.contract,
            installmentTypeController: controllers.installmentType,
            paymentMethodController: controllers.paymentMethod,
            servicePackController: controllers.servicePack,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(Installment.name, {
            id: createInstallmentResponse.installment.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(pathTo(createInstallmentResponse.installment.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'id',
                createInstallmentResponse.installment.id,
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

      describe(`BAD_REQUEST - ${HttpStatus.BAD_REQUEST}`, () => {
        let token: string;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        it('should throw an error due to the lack of data sent', () => {
          return request(app.getHttpServer())
            .put(pathTo(randomUUID()))
            .set(headers.auth, token)
            .expect(HttpStatus.BAD_REQUEST);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;

        const updateInstallmentDto: UpdateInstallmentDto = {
          value: 10,
        };

        let installment: CreateInstallmentResponse;

        beforeAll(async () => {
          token = await getToken.admin();
          installment = await createInstallment({
            installmentController: controllers.installment,
            clientController: controllers.client,
            coinController: controllers.coin,
            companyController: controllers.company,
            contractController: controllers.contract,
            installmentTypeController: controllers.installmentType,
            paymentMethodController: controllers.paymentMethod,
            servicePackController: controllers.servicePack,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(Installment.name, {
            id: installment.installment.id,
          });
        });

        it('should update a installment', () => {
          return request(app.getHttpServer())
            .put(pathTo(installment.installment.id))
            .set(headers.auth, token)
            .send(updateInstallmentDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'id',
                installment.installment.id,
              );
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
        let installment: CreateInstallmentResponse;

        beforeAll(async () => {
          token = await getToken.admin();
          installment = await createInstallment({
            installmentController: controllers.installment,
            clientController: controllers.client,
            coinController: controllers.coin,
            companyController: controllers.company,
            contractController: controllers.contract,
            installmentTypeController: controllers.installmentType,
            paymentMethodController: controllers.paymentMethod,
            servicePackController: controllers.servicePack,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(Installment.name, {
            id: installment.installment.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .delete(pathTo(installment.installment.id))
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
