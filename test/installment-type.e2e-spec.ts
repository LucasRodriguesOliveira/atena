import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { InstallmentType } from '../src/modules/installment/installment-type/entity/installment-type.entity';
import { InstallmentTypeModule } from '../src/modules/installment/installment-type/installment-type.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { CreateInstallmentTypeDto } from '../src/modules/installment/installment-type/dto/create-installment-type.dto';
import { CreateInstallmentTypeResponseDto } from '../src/modules/installment/installment-type/dto/create-installment-type-response.dto';
import { UpdateInstallmentTypeDto } from '../src/modules/installment/installment-type/dto/update-installment-type.dto';
import { InstallmentTypeController } from '../src/modules/installment/installment-type/installment-type.controller';
import { createInstallmentType } from './utils/create/create-installment-type';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { RepositoryManager } from './utils/repository';
import { RepositoryItem } from './utils/repository/repository-item';
import { QueryInstallmentTypeDto } from '../src/modules/installment/installment-type/dto/query-installment-type.dto';

describe('InstallmentTypeController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/installment/type';
  const headers = {
    auth: 'authorization',
  };
  let repositoryManager: RepositoryManager;

  let installmentTypeController: InstallmentTypeController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
        UserModule,
        UserTypeModule,
        InstallmentTypeModule,
      ],
    }).compile();

    installmentTypeController = moduleFixture.get<InstallmentTypeController>(
      InstallmentTypeController,
    );

    repositoryManager = new RepositoryManager(moduleFixture);
    repositoryManager.add([new RepositoryItem(InstallmentType)]);

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
        let createInstallmentTypeResponse: CreateInstallmentTypeResponseDto;
        const queryInstallmentTypeDto: QueryInstallmentTypeDto = {
          description: '',
        };

        beforeAll(async () => {
          token = await getToken.admin();
          createInstallmentTypeResponse = await createInstallmentType({
            installmentTypeController,
          });
          queryInstallmentTypeDto.description =
            createInstallmentTypeResponse.description;
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(InstallmentType.name, {
            id: createInstallmentTypeResponse.id,
          });
        });

        it('should return a list of installmentTypes', () => {
          return request(app.getHttpServer())
            .get(basePath)
            .set(headers.auth, token)
            .query(queryInstallmentTypeDto)
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

        const createInstallmentTypeDto: CreateInstallmentTypeDto = {
          description: 'test',
        };

        let installmentTypeId: number;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(InstallmentType.name, {
            id: installmentTypeId,
          });
        });

        it('should create a installmentType', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .send(createInstallmentTypeDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('id');

              installmentTypeId = response.body.id;
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

  describe('/:installmentTypeId', () => {
    const path = `${basePath}/:installmentTypeId`;
    const pathTo = (installmentTypeId: number) =>
      path.replace(/:installmentTypeId/, `${installmentTypeId}`);

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
        let createInstallmentTypeResponse: CreateInstallmentTypeResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createInstallmentTypeResponse = await createInstallmentType({
            installmentTypeController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(InstallmentType.name, {
            id: createInstallmentTypeResponse.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(pathTo(createInstallmentTypeResponse.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'id',
                createInstallmentTypeResponse.id,
              );
              expect(response.body).toHaveProperty(
                'description',
                createInstallmentTypeResponse.description,
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

        const updateInstallmentTypeDto: UpdateInstallmentTypeDto = {
          description: 'test',
        };

        let installmentType: CreateInstallmentTypeResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          installmentType = await createInstallmentType({
            installmentTypeController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(InstallmentType.name, {
            id: installmentType.id,
          });
        });

        it('should update a installmentType', () => {
          return request(app.getHttpServer())
            .put(pathTo(installmentType.id))
            .set(headers.auth, token)
            .send(updateInstallmentTypeDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', installmentType.id);
              expect(response.body).toHaveProperty(
                'description',
                updateInstallmentTypeDto.description,
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
        let installmentType: CreateInstallmentTypeResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          installmentType = await createInstallmentType({
            installmentTypeController,
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(InstallmentType.name, {
            id: installmentType.id,
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .delete(pathTo(installmentType.id))
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
