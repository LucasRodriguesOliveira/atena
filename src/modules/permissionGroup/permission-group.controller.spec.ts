import { Test, TestingModule } from '@nestjs/testing';
import { PermissionGroupService } from './permission-group.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PermissionGroup } from './entity/permission-group.entity';
import { FindPermissionGroupDto } from './dto/find-permission-group.dto';
import { ListUserTypeDto } from './dto/list-user-type.dto';
import { ListModuleDto } from './dto/list-module.dto';
import { ListPermissionsDto } from './dto/list-permissions.dto';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { PermissionGroupController } from './permission-group.controller';

describe('PermissionGroupController', () => {
  let service: PermissionGroupService;
  let controller: PermissionGroupController;

  const getRawMany = jest.fn();
  const repository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      getRawMany,
    })),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PermissionGroupController],
      providers: [
        PermissionGroupService,
        {
          provide: getRepositoryToken(PermissionGroup),
          useValue: repository,
        },
      ],
    }).compile();

    service = moduleRef.get<PermissionGroupService>(PermissionGroupService);
    controller = moduleRef.get<PermissionGroupController>(
      PermissionGroupController,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  const permissionGroup: PermissionGroup = {
    id: 1,
    createdAt: new Date(),
    userType: {
      id: 1,
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      permissionGroups: [],
      users: [],
    },
    module: {
      id: 1,
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      permissionGroups: [],
    },
    permission: {
      id: 1,
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      permissionGroups: [],
    },
  };

  describe('Find', () => {
    const permissionGroupExpected =
      FindPermissionGroupDto.from(permissionGroup);

    beforeEach(() => {
      repository.findOne.mockResolvedValueOnce(permissionGroup);
    });

    it('should find a permission group by id', async () => {
      const result = await controller.find(permissionGroup.id);

      expect(result).toStrictEqual(permissionGroupExpected);
      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('List User Types', () => {
    const { userType } = permissionGroup;
    const userTypeExpected = ListUserTypeDto.from(userType);

    beforeEach(() => {
      getRawMany.mockResolvedValueOnce([userType]);
    });

    it('should return a list of user types in permission group table', async () => {
      const result = await controller.listUserTypes();

      expect(result).toStrictEqual([userTypeExpected]);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('List Modules', () => {
    const { module } = permissionGroup;
    const moduleExpected = ListModuleDto.from(module);

    beforeEach(() => {
      getRawMany.mockResolvedValueOnce([module]);
    });

    it('should return a list of modules for each user type in permission group table', async () => {
      const result = await controller.listModules(permissionGroup.userType.id);

      expect(result).toStrictEqual([moduleExpected]);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('List Permissions', () => {
    const permissionExpected = ListPermissionsDto.from(permissionGroup);

    beforeEach(() => {
      repository.find.mockResolvedValueOnce([permissionGroup]);
    });

    it('should return a list of permissions for a module and user type in permission group table ', async () => {
      const result = await controller.listPermissions({
        userTypeId: permissionGroup.userType.id,
        moduleId: permissionGroup.module.id,
      });

      expect(result).toStrictEqual([permissionExpected]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('Create a new Permission Group', () => {
    const createPermissionGroupDto: CreatePermissionGroupDto = {
      userTypeId: permissionGroup.userType.id,
      moduleId: permissionGroup.module.id,
      permissionId: permissionGroup.permission.id,
    };

    const permissionGroupExpected =
      FindPermissionGroupDto.from(permissionGroup);

    beforeEach(() => {
      repository.save.mockResolvedValueOnce(permissionGroup);
    });

    it('should create a new permission group', async () => {
      const result = await controller.create(createPermissionGroupDto);

      expect(result).toStrictEqual(permissionGroupExpected);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    beforeEach(() => {
      repository.delete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should delete a permission group', async () => {
      const result = await controller.delete(permissionGroup.id);

      expect(result).toBe(true);
      expect(repository.delete).toHaveBeenCalled();
    });
  });
});
