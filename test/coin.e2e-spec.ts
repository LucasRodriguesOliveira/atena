import { HttpStatus, INestApplication } from '@nestjs/common';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from '../src/config/env/env.config';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { UserModule } from '../src/modules/user/user.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { CoinModule } from '../src/modules/coin/coin.module';
import { CoinController } from '../src/modules/coin/coin.controller';
import { addRepository } from './utils/repository';
import { Coin } from '../src/modules/coin/entity/coin.entity';
import * as request from 'supertest';
import { CreateCoinResponseDto } from '../src/modules/coin/dto/create-coin-response.dto';
import { createCoin } from './utils/create/create-coin';
import { removeAndCheck } from './utils/remove-and-check';
import { removeCoin } from './utils/remove/remove-coin';
import { CreateCoinDto } from '../src/modules/coin/dto/create-coin.dto';
import { UpdateCoinDto } from '../src/modules/coin/dto/update-coin.dto';

describe('CoinController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/coin';
  const headers = {
    auth: 'authorization',
  };

  let coinController: CoinController;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
        UserModule,
        UserTypeModule,
        CoinModule,
      ],
    }).compile();

    coinController = moduleFixture.get<CoinController>(CoinController);

    addRepository({
      testingModule: moduleFixture,
      name: [Coin.name],
    });

    app = moduleFixture.createNestApplication();
    await app.init();

    getToken = await getTokenFactory({
      testingModule: moduleFixture,
      testName: 'coin.e2e',
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
        let createCoinResponseDto: CreateCoinResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createCoinResponseDto = await createCoin({
            coinController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Coin (${createCoinResponseDto.id})`,
            removeFunction: async () =>
              removeCoin({ id: createCoinResponseDto.id }),
          });
        });

        it('should return a list of coins', () => {
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

        const createCoinDto: CreateCoinDto = {
          name: 'test',
          acronym: 'any',
          value: 1,
        };

        let coinId: number;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Coin (${coinId})`,
            removeFunction: async () => removeCoin({ id: coinId }),
          });
        });

        it('should create a coin', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .send(createCoinDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('id');

              coinId = response.body.id;
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

  describe('/:coinId', () => {
    const path = `${basePath}/:coinId`;
    const pathTo = (coinId: number) => path.replace(/:coinId/, `${coinId}`);

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
        let createCoinResponseDto: CreateCoinResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createCoinResponseDto = await createCoin({
            coinController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Coin (${createCoinResponseDto.id})`,
            removeFunction: async () =>
              removeCoin({ id: createCoinResponseDto.id }),
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(pathTo(createCoinResponseDto.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'id',
                createCoinResponseDto.id,
              );
              expect(response.body).toHaveProperty(
                'name',
                createCoinResponseDto.name,
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

        const updateCoinDto: UpdateCoinDto = {
          name: 'test',
        };

        let coin: CreateCoinResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          coin = await createCoin({
            coinController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Coin (${coin.id})`,
            removeFunction: async () => removeCoin({ id: coin.id }),
          });
        });

        it('should update a coin', () => {
          return request(app.getHttpServer())
            .put(pathTo(coin.id))
            .set(headers.auth, token)
            .send(updateCoinDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', coin.id);
              expect(response.body).toHaveProperty('name', updateCoinDto.name);
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
        let coin: CreateCoinResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          coin = await createCoin({
            coinController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Coin (${coin.id})`,
            removeFunction: async () => removeCoin({ id: coin.id }),
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .delete(pathTo(coin.id))
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
