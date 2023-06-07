import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { PaymentMethod } from '../src/modules/payment-method/entity/payment-method.entity';
import { PaymentMethodModule } from '../src/modules/payment-method/payment-method.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { CreatePaymentMethodDto } from '../src/modules/payment-method/dto/create-payment-method.dto';
import { CreatePaymentMethodResponseDto } from '../src/modules/payment-method/dto/create-payment-method-response.dto';
import { UpdatePaymentMethodDto } from '../src/modules/payment-method/dto/update-payment-method.dto';
import { PaymentMethodController } from '../src/modules/payment-method/payment-method.controller';
import { createPaymentMethod } from './utils/create/create-payment-method';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { RepositoryManager } from './utils/repository';
import { RepositoryItem } from './utils/repository/repository-item';

describe('PaymentMethodController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/payment-method';
  const headers = {
    auth: 'authorization',
  };
  let repositoryManager: RepositoryManager;

  let paymentMethodController: PaymentMethodController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
        UserModule,
        UserTypeModule,
        PaymentMethodModule,
      ],
    }).compile();

    paymentMethodController = moduleFixture.get<PaymentMethodController>(
      PaymentMethodController,
    );

    repositoryManager = new RepositoryManager(moduleFixture);
    repositoryManager.add([new RepositoryItem(PaymentMethod)]);

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
        let createPaymentMethodResponse: CreatePaymentMethodResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createPaymentMethodResponse = await createPaymentMethod({
            paymentMethodController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(PaymentMethod.name, {
            id: createPaymentMethodResponse.id,
          });
        });

        it('should return a list of paymentMethods', () => {
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

        const createPaymentMethodDto: CreatePaymentMethodDto = {
          description: 'test',
        };

        let paymentMethodId: number;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(PaymentMethod.name, {
            id: paymentMethodId,
          });
        });

        it('should create a paymentMethod', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .send(createPaymentMethodDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('id');

              paymentMethodId = response.body.id;
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

  describe('/:paymentMethodId', () => {
    const path = `${basePath}/:paymentMethodId`;
    const pathTo = (paymentMethodId: number) =>
      path.replace(/:paymentMethodId/, `${paymentMethodId}`);

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
        let createPaymentMethodResponse: CreatePaymentMethodResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createPaymentMethodResponse = await createPaymentMethod({
            paymentMethodController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(PaymentMethod.name, {
            id: createPaymentMethodResponse.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(pathTo(createPaymentMethodResponse.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'id',
                createPaymentMethodResponse.id,
              );
              expect(response.body).toHaveProperty(
                'description',
                createPaymentMethodResponse.description,
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

        const updatePaymentMethodDto: UpdatePaymentMethodDto = {
          description: 'test',
        };

        let paymentMethod: CreatePaymentMethodResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          paymentMethod = await createPaymentMethod({
            paymentMethodController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(PaymentMethod.name, {
            id: paymentMethod.id,
          });
        });

        it('should update a paymentMethod', () => {
          return request(app.getHttpServer())
            .put(pathTo(paymentMethod.id))
            .set(headers.auth, token)
            .send(updatePaymentMethodDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', paymentMethod.id);
              expect(response.body).toHaveProperty(
                'description',
                updatePaymentMethodDto.description,
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
        let paymentMethod: CreatePaymentMethodResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          paymentMethod = await createPaymentMethod({
            paymentMethodController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(PaymentMethod.name, {
            id: paymentMethod.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .delete(pathTo(paymentMethod.id))
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
