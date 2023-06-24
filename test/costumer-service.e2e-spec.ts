import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { CostumerService } from '../src/modules/costumer-service/entity/costumer-service.entity';
import { CostumerServiceModule } from '../src/modules/costumer-service/costumer-service.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { CreateCostumerServiceDto } from '../src/modules/costumer-service/dto/create-costumer-service.dto';
import { UpdateCostumerServiceDto } from '../src/modules/costumer-service/dto/update-costumer-service.dto';
import { CostumerServiceController } from '../src/modules/costumer-service/costumer-service.controller';
import { createCostumerService } from './utils/create/create-costumer-service';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { RepositoryManager } from './utils/repository';
import { RepositoryItem } from './utils/repository/repository-item';
import { FindCostumerServiceResponseDto } from '../src/modules/costumer-service/dto/find-costumer-service-response.dto';
import { AuthController } from '../src/modules/auth/auth.controller';
import { ClientController } from '../src/modules/client/client.controller';
import { ServiceStageController } from '../src/modules/service-stage/service-stage.controller';
import { ClientModule } from '../src/modules/client/client.module';
import { ServiceStageModule } from '../src/modules/service-stage/service-stage.module';
import { createUser } from './utils/create/create-user';
import { UserTypeEnum } from '../src/modules/user-type/type/user-type.enum';
import { createClient } from './utils/create/create-client';
import { createServiceStage } from './utils/create/create-service-stage';
import { User } from '../src/modules/user/entity/user.entity';

describe('CostumerServiceController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/costumer-service';
  const headers = {
    auth: 'authorization',
  };
  let repositoryManager: RepositoryManager;

  let costumerServiceController: CostumerServiceController;
  let authController: AuthController;
  let clientController: ClientController;
  let serviceStageController: ServiceStageController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
        UserModule,
        UserTypeModule,
        ClientModule,
        ServiceStageModule,
        CostumerServiceModule,
      ],
    }).compile();

    costumerServiceController = moduleFixture.get<CostumerServiceController>(
      CostumerServiceController,
    );
    authController = moduleFixture.get<AuthController>(AuthController);
    clientController = moduleFixture.get<ClientController>(ClientController);
    serviceStageController = moduleFixture.get<ServiceStageController>(
      ServiceStageController,
    );

    repositoryManager = new RepositoryManager(moduleFixture);
    repositoryManager.add([
      new RepositoryItem(CostumerService),
      new RepositoryItem(User),
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
        let createCostumerServiceResponse: FindCostumerServiceResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createCostumerServiceResponse = await createCostumerService({
            costumerServiceController,
            authController,
            clientController,
            serviceStageController,
            repositoryManager,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(CostumerService.name, {
            id: createCostumerServiceResponse.id,
          });
        });

        it('should return a list of costumerServices', () => {
          return request(app.getHttpServer())
            .get(basePath)
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body.data).toHaveProperty('length');
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

        let createCostumerServiceDto: CreateCostumerServiceDto;

        let costumerServiceId: number;

        beforeAll(async () => {
          token = await getToken.admin();
          const [username, client, serviceStage] = await Promise.all([
            createUser({
              authController,
              userType: UserTypeEnum.DEFAULT,
              override: true,
              testName: 'CostumerService',
            }),
            createClient({ clientController }),
            createServiceStage({ serviceStageController }),
          ]);

          const { id: userId } = await repositoryManager.find<User>(User.name, {
            username,
          });

          createCostumerServiceDto = {
            clientId: client.id,
            serviceStageId: serviceStage.id,
            userId,
          };
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(CostumerService.name, {
            id: costumerServiceId,
          });
        });

        it('should create a costumerService', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .send(createCostumerServiceDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('id');

              costumerServiceId = response.body.id;
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

  describe('/:costumerServiceId', () => {
    const path = `${basePath}/:costumerServiceId`;
    const pathTo = (costumerServiceId: number) =>
      path.replace(/:costumerServiceId/, `${costumerServiceId}`);

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
        let createCostumerServiceResponse: FindCostumerServiceResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createCostumerServiceResponse = await createCostumerService({
            costumerServiceController,
            authController,
            clientController,
            serviceStageController,
            repositoryManager,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(CostumerService.name, {
            id: createCostumerServiceResponse.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(pathTo(createCostumerServiceResponse.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'id',
                createCostumerServiceResponse.id,
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

        let updateCostumerServiceDto: UpdateCostumerServiceDto;

        let costumerService: FindCostumerServiceResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          costumerService = await createCostumerService({
            costumerServiceController,
            authController,
            clientController,
            serviceStageController,
            repositoryManager,
          });
          const serviceStage = await createServiceStage({
            serviceStageController,
          });

          updateCostumerServiceDto = {
            serviceStageId: serviceStage.id,
          };
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(CostumerService.name, {
            id: costumerService.id,
          });
        });

        it('should update a costumerService', () => {
          return request(app.getHttpServer())
            .put(pathTo(costumerService.id))
            .set(headers.auth, token)
            .send(updateCostumerServiceDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', costumerService.id);
              expect(response.body).toHaveProperty(
                'serviceStage.id',
                updateCostumerServiceDto.serviceStageId,
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
        let costumerService: FindCostumerServiceResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          costumerService = await createCostumerService({
            costumerServiceController,
            authController,
            clientController,
            serviceStageController,
            repositoryManager,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(CostumerService.name, {
            id: costumerService.id,
          });
        });

        it('should delete a costumer service', () => {
          return request(app.getHttpServer())
            .delete(pathTo(costumerService.id))
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
