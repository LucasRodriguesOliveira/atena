import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { BlackList } from '../src/modules/black-list/item/entity/black-list.entity';
import { BlackListModule } from '../src/modules/black-list/black-list.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { CreateBlackListDto } from '../src/modules/black-list/item/dto/create-black-list.dto';
import { CreateBlackListResponseDto } from '../src/modules/black-list/item/dto/create-black-list-response.dto';
import { UpdateBlackListDto } from '../src/modules/black-list/item/dto/update-black-list.dto';
import { BlackListController } from '../src/modules/black-list/item/black-list.controller';
import { createBlackList } from './utils/create/create-black-list';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { randomBytes } from 'crypto';
import { QueryBlackListDto } from '../src/modules/black-list/item/dto/query-black-list.dto';
import { createBlackListReason } from './utils/create/create-black-list-reason';
import { Reason } from '../src/modules/black-list/reason/entity/reason.entity';
import { CreateReasonDto } from '../src/modules/black-list/reason/dto/create-reason.dto';
import { RepositoryManager } from './utils/repository';
import { RepositoryItem } from './utils/repository/repository-item';
import { ReasonController } from '../src/modules/black-list/reason/reason.controller';
import { ClientController } from '../src/modules/client/client.controller';
import { ClientModule } from '../src/modules/client/client.module';
import { Client } from '../src/modules/client/entity/client.entity';
import { createClient } from './utils/create/create-client';
import { CreateReasonResponseDto } from '../src/modules/black-list/reason/dto/create-reason-response.dto';
import { UpdateReasonDto } from '../src/modules/black-list/reason/dto/update-reason.dto';

describe('BlackListController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/black-list';
  const headers = {
    auth: 'authorization',
  };

  let blackListController: BlackListController;
  let reasonController: ReasonController;
  let clientController: ClientController;

  let repositoryManager: RepositoryManager;

  const pathToFactory = (path: string) => (id: number) => `${path}/${id}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
        UserModule,
        UserTypeModule,
        BlackListModule,
        ClientModule,
      ],
    }).compile();

    blackListController =
      moduleFixture.get<BlackListController>(BlackListController);
    reasonController = moduleFixture.get<ReasonController>(ReasonController);
    clientController = moduleFixture.get<ClientController>(ClientController);

    repositoryManager = new RepositoryManager(moduleFixture);
    repositoryManager.add([
      new RepositoryItem(BlackList),
      new RepositoryItem(Client),
      new RepositoryItem(Reason),
    ]);

    app = moduleFixture.createNestApplication();
    await app.init();

    getToken = await getTokenFactory({
      testingModule: moduleFixture,
      testName: 'blackList.e2e',
    });
  });

  afterAll(async () => {
    await getToken.clear();
    await app.close();
  });

  describe('/item', () => {
    const relativePath = `${basePath}/item`;

    describe('/', () => {
      describe('(GET)', () => {
        describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
          it('should not allow access to the route without a jwt token', () => {
            return request(app.getHttpServer())
              .get(relativePath)
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
              .get(relativePath)
              .set(headers.auth, token)
              .expect(HttpStatus.FORBIDDEN);
          });
        });

        describe(`OK - ${HttpStatus.OK}`, () => {
          let token: string;
          let createBlackListResponse: CreateBlackListResponseDto;

          const queryListBlackListDto: QueryBlackListDto = {
            page: 0,
          };

          beforeAll(async () => {
            token = await getToken.admin();
            createBlackListResponse = await createBlackList({
              blackListController,
              clientController,
              reasonController,
            });
          });

          afterAll(async () => {
            await repositoryManager.removeAndCheck(BlackList.name, {
              id: createBlackListResponse.id,
            });
          });

          it('should return a list of black list items', () => {
            return request(app.getHttpServer())
              .get(relativePath)
              .set(headers.auth, token)
              .query(queryListBlackListDto)
              .expect(HttpStatus.OK)
              .then((response) => {
                expect(response.body).toHaveProperty('total');
                expect(response.body.total).toBeGreaterThanOrEqual(1);
                expect(response.body).toHaveProperty('data');
                expect(response.body.data).toHaveProperty('length');
                expect(response.body.data.length).toBeGreaterThanOrEqual(1);
              });
          });
        });
      });

      describe('(POST)', () => {
        describe(`CREATED - ${HttpStatus.CREATED}`, () => {
          let token: string;
          let createBlackListDto: CreateBlackListDto;
          let blackListItemId: number;

          beforeAll(async () => {
            token = await getToken.admin();

            const [client, reason] = await Promise.all([
              createClient({ clientController }),
              createBlackListReason({ reasonController }),
            ]);

            createBlackListDto = {
              clientId: client.id,
              reasonId: reason.id,
            };
          });

          afterAll(async () => {
            await repositoryManager.removeAndCheck(BlackList.name, {
              id: blackListItemId,
            });
          });

          it('should create a blackList', () => {
            return request(app.getHttpServer())
              .post(relativePath)
              .set(headers.auth, token)
              .send(createBlackListDto)
              .expect(HttpStatus.CREATED)
              .then((response) => {
                expect(response.body).toHaveProperty('id');

                blackListItemId = response.body.id;
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
              .post(relativePath)
              .set(headers.auth, token)
              .expect(HttpStatus.BAD_REQUEST);
          });
        });
      });
    });

    describe('/:blackListItemId', () => {
      const pathTo = pathToFactory(relativePath);

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
          let createBlackListResponse: CreateBlackListResponseDto;

          beforeAll(async () => {
            token = await getToken.admin();
            createBlackListResponse = await createBlackList({
              blackListController,
              clientController,
              reasonController,
            });
          });

          afterAll(async () => {
            await repositoryManager.removeAndCheck(BlackList.name, {
              id: createBlackListResponse.id,
            });
          });

          it(`${HttpStatus.OK}`, () => {
            return request(app.getHttpServer())
              .get(pathTo(createBlackListResponse.id))
              .set(headers.auth, token)
              .expect(HttpStatus.OK)
              .then((response) => {
                expect(response.body).toHaveProperty(
                  'id',
                  createBlackListResponse.id,
                );
                expect(response.body).toHaveProperty(
                  'client.id',
                  createBlackListResponse.client.id,
                );
                expect(response.body).toHaveProperty(
                  'reason.id',
                  createBlackListResponse.reason.id,
                );
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

        describe(`OK - ${HttpStatus.OK}`, () => {
          let token: string;
          let updateBlackListDto: UpdateBlackListDto;
          let blackList: CreateBlackListResponseDto;

          beforeAll(async () => {
            token = await getToken.admin();
            blackList = await createBlackList({
              blackListController,
              clientController,
              reasonController,
            });

            const reason = await createBlackListReason({ reasonController });
            updateBlackListDto = {
              reasonId: reason.id,
            };
          });

          afterAll(async () => {
            await repositoryManager.removeAndCheck(BlackList.name, {
              id: blackList.id,
            });
          });

          it('should update a blackList', () => {
            return request(app.getHttpServer())
              .put(pathTo(blackList.id))
              .set(headers.auth, token)
              .send(updateBlackListDto)
              .expect(HttpStatus.OK)
              .then((response) => {
                expect(response.body).toHaveProperty('id', blackList.id);
                expect(response.body).toHaveProperty(
                  'reason.id',
                  updateBlackListDto.reasonId,
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
          let blackList: CreateBlackListResponseDto;

          beforeAll(async () => {
            token = await getToken.admin();
            blackList = await createBlackList({
              blackListController,
              clientController,
              reasonController,
            });
          });

          afterAll(async () => {
            await repositoryManager.removeAndCheck(BlackList.name, {
              id: blackList.id,
            });
          });

          it(`${HttpStatus.OK}`, () => {
            return request(app.getHttpServer())
              .delete(pathTo(blackList.id))
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

  describe('/reason', () => {
    const relativePath = `${basePath}/reason`;

    describe('(GET)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow access to the route without a jwt token', () => {
          return request(app.getHttpServer())
            .get(relativePath)
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
            .get(relativePath)
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;
        let reason: CreateReasonResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          reason = await createBlackListReason({ reasonController });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(Reason.name, {
            id: reason.id,
          });
        });

        it('should return a list reasons', () => {
          return request(app.getHttpServer())
            .get(relativePath)
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
            .post(relativePath)
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
            .post(relativePath)
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
            .post(relativePath)
            .set(headers.auth, token)
            .expect(HttpStatus.BAD_REQUEST);
        });
      });

      describe(`CREATED - ${HttpStatus.CREATED}`, () => {
        let token: string;
        let reasonId: number;

        const createReasonDto: CreateReasonDto = {
          title: randomBytes(10).toString('hex'),
          details: randomBytes(20).toString('hex'),
        };

        beforeAll(async () => {
          token = await getToken.admin();
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(Reason.name, {
            id: reasonId,
          });
        });

        it('should create a Reason', () => {
          return request(app.getHttpServer())
            .post(relativePath)
            .set(headers.auth, token)
            .send(createReasonDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('id');
              expect(response.body).toHaveProperty(
                'title',
                createReasonDto.title,
              );

              reasonId = response.body.id;
            });
        });
      });
    });

    describe('/:reasonId', () => {
      const pathTo = pathToFactory(relativePath);

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
          let reason: CreateReasonResponseDto;

          beforeAll(async () => {
            token = await getToken.admin();
            reason = await createBlackListReason({ reasonController });
          });

          afterAll(async () => {
            await repositoryManager.removeAndCheck(Reason.name, {
              id: reason.id,
            });
          });

          it('should return a reason', () => {
            return request(app.getHttpServer())
              .get(pathTo(reason.id))
              .set(headers.auth, token)
              .expect(HttpStatus.OK)
              .then((response) => {
                expect(response.body).toHaveProperty('id', reason.id);
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

        describe(`OK - ${HttpStatus.OK}`, () => {
          let token: string;
          const updateReasonDto: UpdateReasonDto = {
            title: randomBytes(10).toString('hex'),
          };
          let reason: CreateReasonResponseDto;

          beforeAll(async () => {
            token = await getToken.admin();
            reason = await createBlackListReason({ reasonController });
          });

          afterAll(async () => {
            await repositoryManager.removeAndCheck(Reason.name, {
              id: reason.id,
            });
          });

          it('should update a blackList', () => {
            return request(app.getHttpServer())
              .put(pathTo(reason.id))
              .set(headers.auth, token)
              .send(updateReasonDto)
              .expect(HttpStatus.OK)
              .then((response) => {
                expect(response.body).toHaveProperty('id', reason.id);
                expect(response.body).toHaveProperty(
                  'title',
                  updateReasonDto.title,
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
          let reason: CreateReasonResponseDto;

          beforeAll(async () => {
            token = await getToken.admin();
            reason = await createBlackListReason({ reasonController });
          });

          afterAll(async () => {
            await Promise.all([
              repositoryManager.removeAndCheck(Reason.name, {
                id: reason.id,
              }),
            ]);
          });

          it('should delete a Reason', () => {
            return request(app.getHttpServer())
              .delete(pathTo(reason.id))
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
});
