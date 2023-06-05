import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { Company } from '../src/modules/company/entity/company.entity';
import { CompanyModule } from '../src/modules/company/company.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { UserModule } from '../src/modules/user/user.module';
import * as request from 'supertest';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { CreateCompanyDto } from '../src/modules/company/dto/create-company.dto';
import { CreateCompanyResponseDto } from '../src/modules/company/dto/create-company-response.dto';
import { UpdateCompanyDto } from '../src/modules/company/dto/update-company.dto';
import { CompanyController } from '../src/modules/company/company.controller';
import { addRepository } from './utils/repository';
import { createCompany } from './utils/create/create-company';
import { removeAndCheck } from './utils/remove-and-check';
import { removeCompany } from './utils/remove/remove-company';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { randomUUID } from 'crypto';
import { QueryListCompanyDto } from 'src/modules/company/dto/query-list-company.dto';

describe('CompanyController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/company';
  const headers = {
    auth: 'authorization',
  };

  let companyController: CompanyController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
        UserModule,
        UserTypeModule,
        CompanyModule,
      ],
    }).compile();

    companyController = moduleFixture.get<CompanyController>(CompanyController);

    addRepository({
      testingModule: moduleFixture,
      name: [Company.name],
    });

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
        let createCompanyResponse: CreateCompanyResponseDto;

        const queryListCompanyDto: QueryListCompanyDto = {
          page: 0,
        };

        beforeAll(async () => {
          token = await getToken.admin();
          createCompanyResponse = await createCompany({
            companyController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Company (${createCompanyResponse.id})`,
            removeFunction: async () =>
              removeCompany({ id: createCompanyResponse.id }),
          });
        });

        it('should return a list of companies', () => {
          return request(app.getHttpServer())
            .get(basePath)
            .set(headers.auth, token)
            .query(queryListCompanyDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('count');
              expect(response.body.count).toBeGreaterThanOrEqual(1);
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

        const createCompanyDto: CreateCompanyDto = {
          name: 'test',
          displayName: 'test',
          email: 'test',
        };

        let companyId: string;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Company (${companyId})`,
            removeFunction: async () => removeCompany({ id: companyId }),
          });
        });

        it('should create a company', () => {
          return request(app.getHttpServer())
            .post(basePath)
            .set(headers.auth, token)
            .send(createCompanyDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('id');

              companyId = response.body.id;
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

  describe('/:companyId', () => {
    const path = `${basePath}/:companyId`;
    const pathTo = (companyId: string) => path.replace(/:companyId/, companyId);

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
        let createCompanyResponse: CreateCompanyResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          createCompanyResponse = await createCompany({
            companyController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Company (${createCompanyResponse.id})`,
            removeFunction: async () =>
              removeCompany({ id: createCompanyResponse.id }),
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .get(pathTo(createCompanyResponse.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty(
                'id',
                createCompanyResponse.id,
              );
              expect(response.body).toHaveProperty(
                'name',
                createCompanyResponse.name,
              );
              expect(response.body).toHaveProperty(
                'displayName',
                createCompanyResponse.displayName,
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

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;

        const updateCompanyDto: UpdateCompanyDto = {
          name: 'test',
        };

        let company: CreateCompanyResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          company = await createCompany({
            companyController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Company (${company.id})`,
            removeFunction: async () => removeCompany({ id: company.id }),
          });
        });

        it('should update a company', () => {
          return request(app.getHttpServer())
            .put(pathTo(company.id))
            .set(headers.auth, token)
            .send(updateCompanyDto)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', company.id);
              expect(response.body).toHaveProperty(
                'name',
                updateCompanyDto.name,
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
        let company: CreateCompanyResponseDto;

        beforeAll(async () => {
          token = await getToken.admin();
          company = await createCompany({
            companyController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Company (${company.id})`,
            removeFunction: async () => removeCompany({ id: company.id }),
          });
        });

        it(`${HttpStatus.OK}`, () => {
          return request(app.getHttpServer())
            .delete(pathTo(company.id))
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
