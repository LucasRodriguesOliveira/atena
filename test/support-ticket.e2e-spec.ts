import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { SupportTicket } from '../src/modules/support-ticket/entity/support-ticket.entity';
import { SupportTicketModule } from '../src/modules/support-ticket/support-ticket.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { CreateSupportTicketDto } from '../src/modules/support-ticket/dto/create-support-ticket.dto';
import { CreateSupportTicketResponseDto } from '../src/modules/support-ticket/dto/create-support-ticket-response.dto';
import { SupportTicketController } from '../src/modules/support-ticket/support-ticket.controller';
import { createSupportTicket } from './utils/create/create-support-ticket';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { QuerySupportTicketDto } from '../src/modules/support-ticket/dto/query-support-ticket.dto';
import { RepositoryManager } from './utils/repository';
import { RepositoryItem } from './utils/repository/repository-item';
import { ClientController } from '../src/modules/client/client.controller';
import { ClientModule } from '../src/modules/client/client.module';
import { Client } from '../src/modules/client/entity/client.entity';
import { createClient } from './utils/create/create-client';
import { AuthController } from '../src/modules/auth/auth.controller';
import { User } from '../src/modules/user/entity/user.entity';
import { createUser } from './utils/create/create-user';
import { UserTypeEnum } from '../src/modules/user-type/type/user-type.enum';
import { randomBytes, randomUUID } from 'crypto';

describe('SupportTicketController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/support-ticket';
  const headers = {
    auth: 'authorization',
  };

  let supportTicketController: SupportTicketController;
  let clientController: ClientController;
  let authController: AuthController;

  let repositoryManager: RepositoryManager;

  const pathToFactory = (path: string) => (id: string) => `${path}/${id}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
        UserModule,
        UserTypeModule,
        SupportTicketModule,
        ClientModule,
      ],
    }).compile();

    supportTicketController = moduleFixture.get<SupportTicketController>(
      SupportTicketController,
    );
    authController = moduleFixture.get<AuthController>(AuthController);
    clientController = moduleFixture.get<ClientController>(ClientController);

    repositoryManager = new RepositoryManager(moduleFixture);
    repositoryManager.add([
      new RepositoryItem(SupportTicket),
      new RepositoryItem(Client),
      new RepositoryItem(User),
    ]);

    app = moduleFixture.createNestApplication();
    await app.init();

    getToken = await getTokenFactory({
      testingModule: moduleFixture,
      testName: 'supportTicket.e2e',
    });
  });

  afterAll(async () => {
    await getToken.clear();
    await app.close();
  });

  describe('', () => {
    const relativePath = `${basePath}`;

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
          let createSupportTicketResponse: CreateSupportTicketResponseDto;

          const queryListSupportTicketDto: QuerySupportTicketDto = {
            page: 0,
          };

          beforeAll(async () => {
            token = await getToken.admin();
            createSupportTicketResponse = await createSupportTicket({
              supportTicketController,
              clientController,
              authController,
              repositoryManager,
            });
          });

          afterAll(async () => {
            await repositoryManager.removeAndCheck(SupportTicket.name, {
              id: createSupportTicketResponse.id,
            });
          });

          it('should return a list of black list items', () => {
            return request(app.getHttpServer())
              .get(relativePath)
              .set(headers.auth, token)
              .query(queryListSupportTicketDto)
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
          let createSupportTicketDto: CreateSupportTicketDto;
          let supportTicketItemId: number;

          beforeAll(async () => {
            token = await getToken.admin();

            const [client, username] = await Promise.all([
              createClient({ clientController }),
              createUser({
                authController,
                userType: UserTypeEnum.DEFAULT,
                override: true,
                testName: 'suppor-ticket.e2e',
              }),
            ]);

            const { id: userId } = await repositoryManager.find<User>(
              User.name,
              { username },
            );

            createSupportTicketDto = {
              clientId: client.id,
              userId,
              reason: randomBytes(10).toString('hex'),
              details: randomBytes(20).toString('hex'),
            };
          });

          afterAll(async () => {
            await repositoryManager.removeAndCheck(SupportTicket.name, {
              id: supportTicketItemId,
            });
          });

          it('should create a supportTicket', () => {
            return request(app.getHttpServer())
              .post(relativePath)
              .set(headers.auth, token)
              .send(createSupportTicketDto)
              .expect(HttpStatus.CREATED)
              .then((response) => {
                expect(response.body).toHaveProperty('id');

                supportTicketItemId = response.body.id;
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

    describe('/:supportTicketItemId', () => {
      const pathTo = pathToFactory(relativePath);

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
          let createSupportTicketResponse: CreateSupportTicketResponseDto;

          beforeAll(async () => {
            token = await getToken.admin();
            createSupportTicketResponse = await createSupportTicket({
              supportTicketController,
              clientController,
              authController,
              repositoryManager,
            });
          });

          afterAll(async () => {
            await repositoryManager.removeAndCheck(SupportTicket.name, {
              id: createSupportTicketResponse.id,
            });
          });

          it(`${HttpStatus.OK}`, () => {
            return request(app.getHttpServer())
              .get(pathTo(createSupportTicketResponse.id))
              .set(headers.auth, token)
              .expect(HttpStatus.OK)
              .then((response) => {
                expect(response.body).toHaveProperty(
                  'id',
                  createSupportTicketResponse.id,
                );
                expect(response.body).toHaveProperty(
                  'client.id',
                  createSupportTicketResponse.client.id,
                );
                expect(response.body).toHaveProperty(
                  'user.id',
                  createSupportTicketResponse.user.id,
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
          let supportTicket: CreateSupportTicketResponseDto;

          beforeAll(async () => {
            token = await getToken.admin();
            supportTicket = await createSupportTicket({
              supportTicketController,
              clientController,
              authController,
              repositoryManager,
            });
          });

          afterAll(async () => {
            await repositoryManager.removeAndCheck(SupportTicket.name, {
              id: supportTicket.id,
            });
          });

          it(`${HttpStatus.OK}`, () => {
            return request(app.getHttpServer())
              .delete(pathTo(supportTicket.id))
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
