import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { ContractController } from '../src/modules/contract/contract.controller';
import { ServicePackController } from '../src/modules/service-pack/service/service-pack.controller';
import { CoinController } from '../src/modules/coin/coin.controller';
import { ClientController } from '../src/modules/client/client.controller';
import { CompanyController } from '../src/modules/company/company.controller';
import { RepositoryManager } from './utils/repository';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserModule } from '../src/modules/user/user.module';
import { ContractModule } from '../src/modules/contract/contract.module';
import { ServicePackModule } from '../src/modules/service-pack/service-pack.module';
import { CoinModule } from '../src/modules/coin/coin.module';
import { ClientModule } from '../src/modules/client/client.module';
import { CompanyModule } from '../src/modules/company/company.module';
import { RepositoryItem } from './utils/repository/repository-item';
import { Contract } from '../src/modules/contract/entity/contract.entity';
import { ServicePack } from '../src/modules/service-pack/service/entity/service-pack.entity';
import { Company } from '../src/modules/company/entity/company.entity';
import { Coin } from '../src/modules/coin/entity/coin.entity';
import { Client } from '../src/modules/client/entity/client.entity';
import { createContract } from './utils/create/create-contract';
import { QueryContractDto } from '../src/modules/contract/dto/query-contract.dto';
import { ContractStatus } from '../src/modules/contract/type/contract-status.enum';
import { CreateContractDto } from '../src/modules/contract/dto/create-contract.dto';
import { randomInt, randomUUID } from 'crypto';
import { createServicePack } from './utils/create/create-service-pack';
import { createCompany } from './utils/create/create-company';
import { createClient } from './utils/create/create-client';
import { CreateContractResponseDto } from '../src/modules/contract/dto/create-contract-response.dto';
import { UpdateContractDto } from '../src/modules/contract/dto/update-contract.dto';

describe('ContractControlle (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/contract';
  const headers = {
    auth: 'authorization',
  };

  let contractController: ContractController;
  let servicePackController: ServicePackController;
  let coinController: CoinController;
  let clientController: ClientController;
  let companyController: CompanyController;

  let repositoryManager: RepositoryManager;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
        UserTypeModule,
        UserModule,
        ContractModule,
        ServicePackModule,
        CoinModule,
        ClientModule,
        CompanyModule,
      ],
    }).compile();

    contractController =
      moduleFixture.get<ContractController>(ContractController);
    servicePackController = moduleFixture.get<ServicePackController>(
      ServicePackController,
    );
    coinController = moduleFixture.get<CoinController>(CoinController);
    clientController = moduleFixture.get<ClientController>(ClientController);
    companyController = moduleFixture.get<CompanyController>(CompanyController);

    repositoryManager = new RepositoryManager(moduleFixture);
    repositoryManager.add([
      new RepositoryItem(Contract),
      new RepositoryItem(ServicePack),
      new RepositoryItem(Company),
      new RepositoryItem(Coin),
      new RepositoryItem(Client),
    ]);

    app = moduleFixture.createNestApplication();
    await app.init();

    getToken = await getTokenFactory({
      testingModule: moduleFixture,
      testName: 'contract.e2e',
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

      describe(`BAD_REQUEST - ${HttpStatus.BAD_REQUEST}`, () => {
        let token: string;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        it('should return BAD_REQUEST for not setting the correct data', () => {
          return request(app.getHttpServer())
            .get(basePath)
            .set(headers.auth, token)
            .expect(HttpStatus.BAD_REQUEST);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;
        let contractId: string;
        const queryContractDto: QueryContractDto = {
          status: ContractStatus.BOTH,
        };

        beforeAll(async () => {
          token = await getToken.admin();
          const contract = await createContract({
            contractController,
            servicePackController,
            companyController,
            coinController,
            clientController,
          });

          contractId = contract.id;
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(Contract.name, {
            id: contractId,
          });
        });

        it('should get a list of contracts', () => {
          return request(app.getHttpServer())
            .get(basePath)
            .set(headers.auth, token)
            .query(queryContractDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('total');
              expect(response.body).toHaveProperty('data');
              expect(response.body.total).toBeGreaterThanOrEqual(1);
              expect(response.body.data.length).toBeGreaterThanOrEqual(1);
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

      describe(`BAD_REQUEST - ${HttpStatus.BAD_REQUEST}`, () => {
        let token: string;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        it('should return BAD_REQUEST for not setting the correct data', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .expect(HttpStatus.BAD_REQUEST);
        });
      });

      describe(`CREATED - ${HttpStatus.CREATED}`, () => {
        let token: string;
        const createContractDto: CreateContractDto = {
          servicePackId: '',
          companyId: '',
          clientId: '',
          coinId: 0,
          expiresAt: new Date(),
          subscriptionPrice: randomInt(100, 1000),
          monthlyPayment: randomInt(100, 500),
          monthlyFee: randomInt(1, 10),
          lateFee: randomInt(1, 10),
        };
        let contractId: string;

        beforeAll(async () => {
          token = await getToken.admin();
          const [servicePack, company, client] = await Promise.all([
            createServicePack({
              servicePackController,
              coinController,
            }),
            createCompany({ companyController }),
            createClient({ clientController }),
          ]);

          createContractDto.servicePackId = servicePack.id;
          createContractDto.companyId = company.id;
          createContractDto.clientId = client.id;
          createContractDto.coinId = servicePack.coin.id;
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(Contract.name, {
            id: contractId,
          });
        });

        it('should create a contract', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .send(createContractDto)
            .then((response) => {
              expect(response.body).toHaveProperty('id');

              contractId = response.body.id;
            });
        });
      });
    });
  });

  describe('/:contractId', () => {
    const path = `${basePath}/:contractId`;
    const pathTo = (id: string) => path.replace(/:\w*[Ii]d/, id);

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

      describe(`NOT_FOUND - ${HttpStatus.NOT_FOUND}`, () => {
        let token: string;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        it('should return NOT_FOUND for not setting the correct data', () => {
          return request(app.getHttpServer())
            .get(pathTo(randomUUID()))
            .set(headers.auth, token)
            .expect(HttpStatus.NOT_FOUND);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token;
        let createContractResponseDto: CreateContractResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createContractResponseDto = await createContract({
            contractController,
            servicePackController,
            companyController,
            clientController,
            coinController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(Contract.name, {
            id: createContractResponseDto.id,
          });
        });

        it('should return a contract by id', () => {
          return request(app.getHttpServer())
            .get(pathTo(createContractResponseDto.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'id',
                createContractResponseDto.id,
              );
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

        it('should return BAD_REQUEST for not setting the query data', () => {
          return request(app.getHttpServer())
            .put(pathTo(randomUUID()))
            .set(headers.auth, token)
            .expect(HttpStatus.BAD_REQUEST);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;
        const updateContractDto: UpdateContractDto = {
          status: true,
        };
        let contractId: string;

        beforeAll(async () => {
          token = await getToken.admin();
          const { id } = await createContract({
            contractController,
            servicePackController,
            companyController,
            clientController,
            coinController,
          });
          contractId = id;
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(Contract.name, {
            id: contractId,
          });
        });

        it('should update a contract', () => {
          return request(app.getHttpServer())
            .put(pathTo(contractId))
            .set(headers.auth, token)
            .send(updateContractDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', contractId);
            });
        });
      });
    });

    describe('(DELETE)', () => {
      let token: string;
      let contractId: string;

      beforeAll(async () => {
        token = await getToken.admin();
        const { id } = await createContract({
          contractController,
          servicePackController,
          companyController,
          clientController,
          coinController,
        });
        contractId = id;
      });

      afterAll(async () => {
        await repositoryManager.removeAndCheck(Contract.name, {
          id: contractId,
        });
      });

      it('should delete a contract', () => {
        return request(app.getHttpServer())
          .delete(pathTo(contractId))
          .set(headers.auth, token)
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(JSON.parse(response.text)).toBe(true);
          });
      });
    });
  });
});
