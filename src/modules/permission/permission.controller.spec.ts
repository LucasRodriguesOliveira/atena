import { Repository } from 'typeorm';
import { PermissionService } from './permission.service';
import { Permission } from './entity/permission.entity';
import { MockType } from 'test/utils/mock-type';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PermissionController } from './permission.controller';
import { FindPermissionDto } from './dto/find-permission.dto';
import { ListPermissionDto } from './dto/list-permission.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreatePermissionResponse } from './dto/create-permission-response.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UpdatePermissionResponse } from './dto/update-permission-response.dto';
import { HttpException } from '@nestjs/common';

describe('PermissionController', () => {
  let controller: PermissionController;
  let service: PermissionService;
  const repository: MockType<Repository<Permission>> = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [
        PermissionService,
        { provide: getRepositoryToken(Permission), useValue: repository },
      ],
    }).compile();

    service = moduleRef.get<PermissionService>(PermissionService);
    controller = moduleRef.get<PermissionController>(PermissionController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  describe('Find', () => {
    const permissionId = 0;

    describe('success', () => {
      const permissionExpected: Permission = {
        id: 1,
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        permissionGroups: [],
      };

      beforeAll(() => {
        repository.findOne.mockResolvedValueOnce(permissionExpected);
      });

      it('should find a permission by id', async () => {
        const result = await controller.find(permissionId);

        expect(repository.findOne).toHaveBeenCalled();
        expect(result).toEqual(FindPermissionDto.from(permissionExpected));
      });
    });

    describe('fail', () => {
      beforeAll(() => {
        repository.findOne.mockResolvedValueOnce({});
      });

      it('should throw an error when not finding a permission', async () => {
        await expect(() => controller.find(permissionId)).rejects.toThrow(
          HttpException,
        );

        expect(repository.findOne).toHaveBeenCalled();
      });
    });
  });

  describe('List', () => {
    const permissionList: Permission[] = [
      {
        id: 1,
        description: 'test 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        permissionGroups: [],
      },
      {
        id: 2,
        description: 'test 2',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        permissionGroups: [],
      },
    ];
    const permissionListExpected = permissionList.map((permission) =>
      ListPermissionDto.from(permission),
    );

    beforeAll(() => {
      repository.find.mockResolvedValueOnce(permissionList);
    });

    it('should return a list of permissions', async () => {
      const result = await controller.list();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toStrictEqual(permissionListExpected);
    });
  });

  describe('Create', () => {
    const permission: Permission = {
      id: 1,
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      permissionGroups: [],
    };
    const createPermissionDto: CreatePermissionDto = {
      description: 'test',
    };

    beforeAll(() => {
      repository.save.mockResolvedValueOnce(permission);
    });

    it('should create a permission', async () => {
      const result = await controller.create(createPermissionDto);

      expect(repository.save).toHaveBeenCalled();
      expect(result).toStrictEqual(CreatePermissionResponse.from(permission));
    });
  });

  describe('Update', () => {
    const permission: Permission = {
      id: 1,
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      permissionGroups: [],
    };

    const updatePermissionDto: UpdatePermissionDto = {
      description: permission.description,
    };

    beforeAll(() => {
      repository.update.mockResolvedValueOnce({ affected: 1 });
      repository.findOne.mockResolvedValueOnce(permission);
    });

    it('should update a permission', async () => {
      const result = await controller.update(
        permission.id,
        updatePermissionDto,
      );

      expect(repository.update).toHaveBeenCalled();
      expect(repository.findOne).toHaveBeenCalled();
      expect(result).toStrictEqual(UpdatePermissionResponse.from(permission));
    });
  });

  describe('Delete', () => {
    const permissionId = 1;

    beforeAll(() => {
      repository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should soft delete a permission', async () => {
      const result = await controller.delete(permissionId);

      expect(repository.softDelete).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
