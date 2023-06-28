import { AuthController } from '../src/modules/auth/auth.controller';
import { CompanyController } from '../src/modules/company/company.controller';
import { UserCompanyController } from '../src/modules/company/user-company.controller';
import { CreateUserCompanyDto } from '../src/modules/company/dto/create-user-company.dto';
import { createUser } from './utils/create/create-user';
import { UserTypeEnum } from '../src/modules/user-type/type/user-type.enum';
import {
  CreateUserCompanyMockResponse,
  createUserCompany,
} from './utils/create/create-user-company';
import { randomUUID } from 'crypto';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { CompanyModule } from '../src/modules/company/company.module';
import { Company } from '../src/modules/company/entity/company.entity';
import { UserCompany } from '../src/modules/company/entity/user-company.entity';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { User } from '../src/modules/user/entity/user.entity';
import { UserModule } from '../src/modules/user/user.module';
import { createCompany } from './utils/create/create-company';
import { TokenFactoryResponse, getTokenFactory } from './utils/get-token';
import { RepositoryManager } from './utils/repository';
import * as request from 'supertest';
import { RepositoryItem } from './utils/repository/repository-item';

describe('UserCompanyController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/company';
  const headers = {
    auth: 'authorization',
  };

  let userCompanyController: UserCompanyController;
  let companyController: CompanyController;
  let authController: AuthController;
  let repositoryManager: RepositoryManager;

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
    userCompanyController = moduleFixture.get<UserCompanyController>(
      UserCompanyController,
    );
    authController = moduleFixture.get<AuthController>(AuthController);

    repositoryManager = new RepositoryManager(moduleFixture);
    repositoryManager.add([
      new RepositoryItem(Company),
      new RepositoryItem(User),
      new RepositoryItem(UserCompany),
    ]);

    app = moduleFixture.createNestApplication();
    await app.init();

    getToken = await getTokenFactory({
      testingModule: moduleFixture,
      testName: 'usercompany.e2e',
    });
  });

  afterAll(async () => {
    await getToken.clear();
    await app.close();
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
            userCompanyController,
            companyController,
            repositoryManager,
            testName: 'usercompany.e2e',
          });
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(UserCompany.name, {
            id: userCompany.id,
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

          const { id: userId } = await repositoryManager.find<User>(User.name, {
            username,
          });
          const company = await createCompany({
            companyController,
          });

          createUserCompanyDto.userId = userId;
          createUserCompanyMockResponse.companyId = company.id;
          createUserCompanyMockResponse.username = username;
        });

        afterAll(async () => {
          await repositoryManager.removeAndCheck(UserCompany.name, {
            id: createUserCompanyMockResponse.id,
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
            userCompanyController,
            companyController,
            repositoryManager,
            testName: 'usercompany.e2e',
          });
        });

        afterAll(async () => {
          await Promise.all([
            repositoryManager.removeAndCheck(Company.name, {
              id: createUserCompanyMockResponse.companyId,
            }),
            repositoryManager.removeAndCheck(User.name, {
              username: createUserCompanyMockResponse.username,
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
