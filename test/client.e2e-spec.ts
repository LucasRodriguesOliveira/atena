import { HttpStatus, INestApplication } from '@nestjs/common';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from '../src/config/env/env.config';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { ClientModule } from '../src/modules/client/client.module';
import { ClientController } from '../src/modules/client/client.controller';
import { Client } from '../src/modules/client/entity/client.entity';
import * as request from 'supertest';
import { CreateClientResponseDto } from '../src/modules/client/dto/create-client-response.dto';
import { createClient } from './utils/create/create-client';
import { CreateClientDto } from '../src/modules/client/dto/create-client.dto';
import { UpdateClientDto } from '../src/modules/client/dto/update-client.dto';
import { RepositoryManager } from './utils/repository';
import { RepositoryItem } from './utils/repository/repository-item';
import { randomUUID } from 'crypto';

describe('ClientController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/client';
  const headers = {
    auth: 'authorization',
  };

  let clientController: ClientController;

  let repositoryManager: RepositoryManager;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
        ClientModule,
      ],
    }).compile();

    clientController = moduleFixture.get<ClientController>(ClientController);

    repositoryManager = new RepositoryManager(moduleFixture);
    repositoryManager.add([new RepositoryItem(Client)]);

    app = moduleFixture.createNestApplication();
    await app.init();

    getToken = await getTokenFactory({
      testingModule: moduleFixture,
      testName: 'client.e2e',
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
        let createClientResponseDto: CreateClientResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createClientResponseDto = await createClient({
            clientController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(Client.name, {
            id: createClientResponseDto.id,
          });
        });

        it('should return a list of clients', () => {
          return request(app.getHttpServer())
            .get(basePath)
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('data.length');
              expect(response.body.count).toBeGreaterThanOrEqual(1);
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

        const createClientDto: CreateClientDto = {
          name: 'test',
          email: 'test@test.com',
        };

        let clientId: number;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(Client.name, {
            id: clientId,
          });
        });

        it('should create a client', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .send(createClientDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('id');

              clientId = response.body.id;
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

  describe('/:clientId', () => {
    const path = `${basePath}/:clientId`;
    const pathTo = (clientId: string) =>
      path.replace(/:clientId/, `${clientId}`);

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

        beforeEach(async () => {
          token = await getToken.admin();
        });

        it('should throw an error for not finding the client', () => {
          return request(app.getHttpServer())
            .get(pathTo(randomUUID()))
            .set(headers.auth, token)
            .expect(HttpStatus.NOT_FOUND);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;
        let createClientResponseDto: CreateClientResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createClientResponseDto = await createClient({
            clientController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(Client.name, {
            id: createClientResponseDto.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(pathTo(createClientResponseDto.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'id',
                createClientResponseDto.id,
              );
              expect(response.body).toHaveProperty(
                'name',
                createClientResponseDto.name,
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

        const updateClientDto: UpdateClientDto = {
          name: 'test',
        };

        let client: CreateClientResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          client = await createClient({
            clientController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(Client.name, {
            id: client.id,
          });
        });

        it('should update a client', () => {
          return request(app.getHttpServer())
            .put(pathTo(client.id))
            .set(headers.auth, token)
            .send(updateClientDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', client.id);
              expect(response.body).toHaveProperty(
                'name',
                updateClientDto.name,
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
        let client: CreateClientResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          client = await createClient({
            clientController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(Client.name, {
            id: client.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .delete(pathTo(client.id))
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
