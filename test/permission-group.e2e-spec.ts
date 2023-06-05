import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { envConfig } from '../src/config/env/env.config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { PermissionGroupModule } from '../src/modules/permissionGroup/permission-group.module';
import { getTokenFactory, TokenFactoryResponse } from './utils/get-token';
import { FindPermissionGroupDto } from '../src/modules/permissionGroup/dto/find-permission-group.dto';
import { createPermissionGroup } from './utils/create/create-permission-group';
import { removePermissionGroup } from './utils/remove/remove-permission-group';
import * as request from 'supertest';
import { removeAndCheck } from './utils/remove-and-check';
import { UserModule } from '../src/modules/user/user.module';
import { UserTypeModule } from '../src/modules/user-type/user-type.module';
import { TypeormPostgresModule } from '../src/modules/typeorm/typeorm.module';
import { PermissionModule } from '../src/modules/permission/permission.module';
import { ModuleModule } from '../src/modules/module/module.module';
import { Module } from '../src/modules/module/entity/module.entity';
import { addRepository } from './utils/repository';
import { Permission } from '../src/modules/permission/entity/permission.entity';
import { UserType } from '../src/modules/user-type/entity/user-type.entity';
import { User } from '../src/modules/user/entity/user.entity';
import { ModuleController } from '../src/modules/module/module.controller';
import { PermissionController } from '../src/modules/permission/permission.controller';
import { UserTypeController } from '../src/modules/user-type/user-type.controller';
import { PermissionGroup } from '../src/modules/permissionGroup/entity/permission-group.entity';
import { PermissionGroupController } from '../src/modules/permissionGroup/permission-group.controller';
import { CreatePermissionGroupDto } from 'src/modules/permissionGroup/dto/create-permission-group.dto';
import { createPermission } from './utils/create/create-permission';
import { createModule } from './utils/create/create-module';
import { createUserType } from './utils/create/create-user-type';
import { removePermission } from './utils/remove/remove-permission';
import { removeModule } from './utils/remove/remove-module';
import { removeUserType } from './utils/remove/remove-user-type';

describe('PermissionGroupController (e2e)', () => {
  let app: INestApplication;
  let getToken: TokenFactoryResponse;

  const basePath = '/permission-group';
  const headers = {
    auth: 'authorization',
  };

  let userTypeController: UserTypeController;
  let permissionController: PermissionController;
  let moduleController: ModuleController;
  let permissionGroupController: PermissionGroupController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        TypeormPostgresModule,
        AuthModule,
        UserModule,
        UserTypeModule,
        PermissionGroupModule,
        PermissionModule,
        ModuleModule,
      ],
    }).compile();

    userTypeController =
      moduleFixture.get<UserTypeController>(UserTypeController);
    permissionController =
      moduleFixture.get<PermissionController>(PermissionController);
    moduleController = moduleFixture.get<ModuleController>(ModuleController);
    permissionGroupController = moduleFixture.get<PermissionGroupController>(
      PermissionGroupController,
    );

    addRepository({
      testingModule: moduleFixture,
      name: [
        Module.name,
        Permission.name,
        UserType.name,
        User.name,
        PermissionGroup.name,
      ],
    });

    app = moduleFixture.createNestApplication();
    await app.init();

    getToken = await getTokenFactory({ testingModule: moduleFixture });
  });

  afterAll(async () => {
    await getToken.clear();
    await app.close();
  });

  describe('/:permissionGroupId', () => {
    const path = `${basePath}/:permissionGroupId`;
    const pathTo = (id: number) => path.replace(/:permissionGroupId/, `${id}`);

    describe('(GET)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow access to the route without a jwt token', () => {
          return request(app.getHttpServer())
            .get(pathTo(-1)) // since it will not be accessed, doesn't mattter if it exists or not
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
            .get(pathTo(-1)) // since it will not be accessed, doesn't mattter if it exists or not
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let permissionGroup: FindPermissionGroupDto;
        let token: string;

        beforeAll(async () => {
          token = await getToken.admin();
          permissionGroup = await createPermissionGroup({
            userTypeController,
            moduleController,
            permissionController,
            permissionGroupController,
          });
        });

        afterAll(async () => {
          await removeAndCheck({
            name: `Permission Group [${permissionGroup.id}]`,
            removeFunction: async () =>
              removePermissionGroup({ permissionGroup }),
          });
        });

        it('should find a Permission Group by Id', () => {
          return request(app.getHttpServer())
            .get(pathTo(permissionGroup.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(response.body).toHaveProperty('id', permissionGroup.id);
              expect(response.body).toHaveProperty('userType');
              expect(response.body).toHaveProperty('permission');
              expect(response.body).toHaveProperty('module');
            });
        });
      });

      describe(`NOT_FOUND - ${HttpStatus.NOT_FOUND}`, () => {
        let token: string;

        beforeAll(async () => {
          token = await getToken.admin();
        });

        it('should not find a Permission Group by Id', () => {
          return request(app.getHttpServer())
            .get(pathTo(-1))
            .set(headers.auth, token)
            .expect(HttpStatus.NOT_FOUND);
        });
      });
    });

    describe('(DELETE)', () => {
      describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
        it('should not allow to access to the route without a jwt token', () => {
          return request(app.getHttpServer())
            .delete(pathTo(-1))
            .expect(HttpStatus.UNAUTHORIZED);
        });
      });

      describe(`FORBIDDEN - ${HttpStatus.FORBIDDEN}`, () => {
        let token: string;

        beforeEach(async () => {
          token = await getToken.default();
        });

        it('should not allow access due to user type is not admin', () => {
          return request(app.getHttpServer())
            .delete(pathTo(-1))
            .set(headers.auth, token)
            .expect(HttpStatus.FORBIDDEN);
        });
      });

      describe(`OK - ${HttpStatus.OK}`, () => {
        let token: string;
        let permissionGroup: FindPermissionGroupDto;

        beforeAll(async () => {
          token = await getToken.admin();
          permissionGroup = await createPermissionGroup({
            userTypeController,
            moduleController,
            permissionController,
            permissionGroupController,
          });
        });

        afterAll(async () => {
          await Promise.all([
            removeAndCheck({
              name: `Permission [${permissionGroup.permission.id}]`,
              removeFunction: async () =>
                removePermission({ id: permissionGroup.permission.id }),
            }),
            removeAndCheck({
              name: `Module [${permissionGroup.module.id}]`,
              removeFunction: async () =>
                removeModule({ id: permissionGroup.module.id }),
            }),
            removeAndCheck({
              name: `User Type [${permissionGroup.userType.id}]`,
              removeFunction: async () =>
                removeUserType({ id: permissionGroup.userType.id }),
            }),
          ]);
        });

        it('should delete a permission group by id', () => {
          return request(app.getHttpServer())
            .delete(pathTo(permissionGroup.id))
            .set(headers.auth, token)
            .expect(HttpStatus.OK)
            .then((response) => {
              expect(JSON.parse(response.text)).toBe(true);
            });
        });
      });
    });
  });

  describe('/all/user-types - (GET)', () => {
    const path = `${basePath}/all/user-types`;

    describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
      it('should not allow to access to the route without a jwt token', () => {
        return request(app.getHttpServer())
          .get(path)
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe(`FORBIDDEN - ${HttpStatus.FORBIDDEN}`, () => {
      let token: string;

      beforeEach(async () => {
        token = await getToken.default();
      });

      it('should not allow to access due to user type is not admin', () => {
        return request(app.getHttpServer())
          .get(path)
          .set(headers.auth, token)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe(`OK - ${HttpStatus.OK}`, () => {
      let token: string;
      let permissionGroup: FindPermissionGroupDto;

      beforeEach(async () => {
        token = await getToken.admin();
        permissionGroup = await createPermissionGroup({
          moduleController,
          permissionController,
          permissionGroupController,
          userTypeController,
        });
      });

      afterEach(async () => {
        await removeAndCheck({
          name: `Permission Group [${permissionGroup.id}]`,
          removeFunction: async () =>
            removePermissionGroup({ permissionGroup }),
        });
      });

      it('should find all the user types in permission group table', () => {
        return request(app.getHttpServer())
          .get(path)
          .set(headers.auth, token)
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body).toHaveProperty('length');
            expect(response.body.length).toBeGreaterThanOrEqual(1);
          });
      });
    });
  });

  describe('/:userTypeId/modules - (GET)', () => {
    const path = `${basePath}/:userTypeId/modules`;
    const pathTo = (id: number) => path.replace(/:userTypeId/, `${id}`);

    describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
      it('should not allow to access to the route without a jwt token', () => {
        return request(app.getHttpServer())
          .get(pathTo(-1))
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe(`FORBIDDEN - ${HttpStatus.FORBIDDEN}`, () => {
      let token: string;

      beforeEach(async () => {
        token = await getToken.default();
      });

      it('should not allow to access due to user type is not admin', () => {
        return request(app.getHttpServer())
          .get(pathTo(-1))
          .set(headers.auth, token)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe(`OK - ${HttpStatus.OK}`, () => {
      let token: string;
      let permissionGroup: FindPermissionGroupDto;

      beforeEach(async () => {
        token = await getToken.admin();
        permissionGroup = await createPermissionGroup({
          moduleController,
          permissionController,
          permissionGroupController,
          userTypeController,
        });
      });

      afterEach(async () => {
        await removeAndCheck({
          name: `Permission Group [${permissionGroup.id}]`,
          removeFunction: async () =>
            removePermissionGroup({ permissionGroup }),
        });
      });

      it('should find all the modules in permission group table by user type id', () => {
        return request(app.getHttpServer())
          .get(pathTo(permissionGroup.userType.id))
          .set(headers.auth, token)
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body).toHaveLength(1);
            expect(response.body).toHaveProperty(
              '[0].id',
              permissionGroup.module.id,
            );
          });
      });
    });
  });

  describe('/:userTypeId/:moduleId/permissions - (GET)', () => {
    const path = `${basePath}/:userTypeId/:moduleId/permissions`;
    const pathTo = (userTypeId: number, moduleId) =>
      path
        .replace(/:userTypeId/, `${userTypeId}`)
        .replace(/:moduleId/, moduleId);

    describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
      it('should not allow to access to the route without a jwt token', () => {
        return request(app.getHttpServer())
          .get(pathTo(-1, -1))
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe(`FORBIDDEN - ${HttpStatus.FORBIDDEN}`, () => {
      let token: string;

      beforeEach(async () => {
        token = await getToken.default();
      });

      it('should not allow to access due to user type is not admin', () => {
        return request(app.getHttpServer())
          .get(pathTo(-1, -1))
          .set(headers.auth, token)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe(`OK - ${HttpStatus.OK}`, () => {
      let token: string;
      let permissionGroup: FindPermissionGroupDto;

      beforeEach(async () => {
        token = await getToken.admin();
        permissionGroup = await createPermissionGroup({
          moduleController,
          permissionController,
          permissionGroupController,
          userTypeController,
        });
      });

      afterEach(async () => {
        await removeAndCheck({
          name: `Permission Group [${permissionGroup.id}]`,
          removeFunction: async () =>
            removePermissionGroup({ permissionGroup }),
        });
      });

      it('should find all the permissions in permission group table by user type id and module id', () => {
        return request(app.getHttpServer())
          .get(pathTo(permissionGroup.userType.id, permissionGroup.module.id))
          .set(headers.auth, token)
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body).toHaveLength(1);
          });
      });
    });
  });

  describe('/ - (POST)', () => {
    describe(`UNAUTHORIZED - ${HttpStatus.UNAUTHORIZED}`, () => {
      it('should not allow to access to the route without a jwt token', () => {
        return request(app.getHttpServer())
          .post(basePath)
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe(`FORBIDDEN - ${HttpStatus.FORBIDDEN}`, () => {
      let token: string;

      beforeEach(async () => {
        token = await getToken.default();
      });

      it('should not allow to access due to user type is not admin', () => {
        return request(app.getHttpServer())
          .post(basePath)
          .set(headers.auth, token)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe(`BAD_REQUEST - ${HttpStatus.BAD_REQUEST}`, () => {
      let token: string;

      beforeEach(async () => {
        token = await getToken.admin();
      });

      it('should not proceed due to lack of data sent or the data is not following the requirements', () => {
        return request(app.getHttpServer())
          .post(basePath)
          .set(headers.auth, token)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe(`CREATED - ${HttpStatus.CREATED}`, () => {
      let token: string;
      const createPermissionGroupDto: CreatePermissionGroupDto = {
        moduleId: 0,
        permissionId: 0,
        userTypeId: 0,
      };
      let permissionGroupId: number;

      beforeEach(async () => {
        token = await getToken.admin();

        const [permission, module, userType] = await Promise.all([
          createPermission({ permissionController }),
          createModule({ moduleController }),
          createUserType({ userTypeController }),
        ]);

        createPermissionGroupDto.permissionId = permission.id;
        createPermissionGroupDto.moduleId = module.id;
        createPermissionGroupDto.userTypeId = userType.id;
      });

      afterEach(async () => {
        await removeAndCheck({
          name: `Permission Group (${permissionGroupId})`,
          removeFunction: async () =>
            removePermissionGroup({
              permissionGroup: {
                id: permissionGroupId,
                module: {
                  id: createPermissionGroupDto.moduleId,
                },
                permission: {
                  id: createPermissionGroupDto.permissionId,
                },
                userType: {
                  id: createPermissionGroupDto.userTypeId,
                },
              },
            }),
        });
      });

      it('should create a new PermissionGroup', () => {
        return request(app.getHttpServer())
          .post(basePath)
          .set(headers.auth, token)
          .send(createPermissionGroupDto)
          .expect(HttpStatus.CREATED)
          .then((response) => {
            expect(response.body).toHaveProperty('id');

            permissionGroupId = response.body.id;
          });
      });
    });
  });
});
