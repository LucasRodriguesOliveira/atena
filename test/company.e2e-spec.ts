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
import { addRepository, repository } from './utils/repository';
import { createCompany } from './utils/create/create-company';
import { removeAndCheck } from './utils/remove-and-check';
import { removeCompany } from './utils/remove/remove-company';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { randomUUID } from 'crypto';
import { QueryListCompanyDto } from '../src/modules/company/dto/query-list-company.dto';
import {
  CreateUserCompanyMockResponse,
  createUserCompany,
} from './utils/create/create-user-company';
import { AuthController } from '../src/modules/auth/auth.controller';
import { removeUserCompany } from './utils/remove/remove-user-company';
import { User } from '../src/modules/user/entity/user.entity';
import { UserCompany } from '../src/modules/company/entity/user-company.entity';
import { CreateUserCompanyDto } from '../src/modules/company/dto/create-user-company.dto';
import { createUser } from './utils/create/create-user';
import { UserTypeEnum } from '../src/modules/user-type/type/user-type.enum';
import { Repository } from 'typeorm';
import { removeUser } from './utils/remove/remove-user';

describe('CompanyController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/company';
  const headers = {
    auth: 'authorization',
  };

  let companyController: CompanyController;
  let authController: AuthController;

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
    authController = moduleFixture.get<AuthController>(AuthController);

    addRepository({
      testingModule: moduleFixture,
      name: [Company.name, User.name, UserCompany.name],
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

  describe('/:companyId/user', () => {
    const path = `${basePath}/:companyId/user`;
    const pathTo = (companyId: string | number) =>
      path.replace(/:companyId/, `${companyId}`);

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
        let userCompany: CreateUserCompanyMockResponse;

        beforeAll(async () => {
          token = await getToken.admin();
          userCompany = await createUserCompany({
            authController,
            companyController,
            testName: 'company.e2e',
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `UserCompany (${userCompany.id})`,
            removeFunction: async () => removeUserCompany({ userCompany }),
          });
        });

        it('should return a list of users attached to a company', () => {
          return request(app.getHttpServer())
            .get(pathTo(userCompany.companyId))
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
            .post(pathTo(randomUUID()))
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
            .post(pathTo(randomUUID()))
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
            .post(pathTo(randomUUID()))
            .set(headers.auth, token)
            .expect(HttpStatus.BAD_REQUEST);
        });
      });

      describe(`CREATED - ${HttpStatus.CREATED}`, () => {
        let token: string;
        const createUserCompanyDto: CreateUserCompanyDto = {
          userId: '',
        };
        const createUserCompanyMockResponse: CreateUserCompanyMockResponse = {
          companyId: '',
          username: '',
          id: -1,
        };

        beforeAll(async () => {
          token = await getToken.admin();
          const username = await createUser({
            authController,
            userType: UserTypeEnum.DEFAULT,
            override: true,
            testName: 'UserCompany',
          });

          const userRepository = repository.get(User.name) as Repository<User>;
          const { id: userId } = await userRepository.findOneBy({ username });
          const company = await createCompany({
            companyController,
          });

          createUserCompanyDto.userId = userId;
          createUserCompanyMockResponse.companyId = company.id;
          createUserCompanyMockResponse.username = username;
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `UserCompany (${createUserCompanyMockResponse.id})`,
            removeFunction: async () =>
              removeUserCompany({ userCompany: createUserCompanyMockResponse }),
          });
        });

        it('should create a UserCompany', () => {
          return request(app.getHttpServer())
            .post(pathTo(createUserCompanyMockResponse.companyId))
            .set(headers.auth, token)
            .send(createUserCompanyDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
              expect(response.body).toHaveProperty('id');
              expect(response.body).toHaveProperty(
                'companyId',
                createUserCompanyMockResponse.companyId,
              );
              expect(response.body).toHaveProperty(
                'userId',
                createUserCompanyDto.userId,
              );

              createUserCompanyMockResponse.id = response.body.id;
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
        let createUserCompanyMockResponse: CreateUserCompanyMockResponse;

        beforeAll(async () => {
          token = await getToken.admin();
          createUserCompanyMockResponse = await createUserCompany({
            authController,
            companyController,
            testName: 'company.e2e',
          });
        });

        afterAll(async () => {
          await Promise.all([
            removeAndCheck({
              name: `Company (${createUserCompanyMockResponse.companyId})`,
              removeFunction: async () =>
                removeCompany({ id: createUserCompanyMockResponse.companyId }),
            }),
            removeAndCheck({
              name: `User (${createUserCompanyMockResponse.username})`,
              removeFunction: async () =>
                removeUser({
                  username: createUserCompanyMockResponse.username,
                }),
            }),
          ]);
        });

        it('should delete a UserCompany', () => {
          return request(app.getHttpServer())
            .delete(pathTo(createUserCompanyMockResponse.id))
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
