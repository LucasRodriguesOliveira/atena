import { Test, TestingModule } from '@nestjs/testing';
import { ModuleService } from './module.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Module } from './entity/module.entity';
import { ListModuleDto } from './dto/list-module.dto';
import { FindModuleDto } from './dto/find-module.dto';
import { CreateModuleResponse } from './dto/create-module-response.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { UpdateModuleResponse } from './dto/update-module-response.dto';

describe('ModuleService', () => {
  let service: ModuleService;
  const repository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ModuleService,
        { provide: getRepositoryToken(Module), useValue: repository },
      ],
    }).compile();

    service = moduleRef.get<ModuleService>(ModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find', () => {
    describe('success', () => {
      const moduleItem: Module = {
        id: 1,
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const expectedModule = FindModuleDto.from(moduleItem);

      beforeEach(() => {
        repository.findOne.mockResolvedValueOnce(moduleItem);
      });

      it('should find a module', async () => {
        const result = await service.find(moduleItem.id);

        expect(result).toStrictEqual(expectedModule);
        expect(repository.findOne).toHaveBeenCalled();
      });
    });

    describe('fail', () => {
      const moduleId = 1;

      beforeEach(() => {
        repository.findOne.mockResolvedValueOnce({});
      });

      it('should receive a null value', async () => {
        const result = await service.find(moduleId);

        expect(result).toBeNull();
        expect(repository.findOne).toHaveBeenCalled();
      });
    });
  });

  describe('List', () => {
    const moduleList: Module[] = [
      {
        id: 1,
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
      {
        id: 2,
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
    ];

    const expectedModuleList = moduleList.map((moduleItem) =>
      ListModuleDto.from(moduleItem),
    );

    beforeEach(() => {
      repository.find.mockResolvedValueOnce(moduleList);
    });

    it('should return a list of modules', async () => {
      const result = await service.list();

      expect(result).toStrictEqual(expectedModuleList);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('Create', () => {
    const moduleItem: Module = {
      id: 1,
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };
    const expectedModuleItem = CreateModuleResponse.from(moduleItem);
    const createModuleDto: CreateModuleDto = {
      description: moduleItem.description,
    };

    beforeAll(() => {
      repository.save.mockResolvedValueOnce(moduleItem);
    });

    it('should create a module', async () => {
      const result = await service.create(createModuleDto);

      expect(result).toStrictEqual(expectedModuleItem);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const moduleItem: Module = {
      id: 1,
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };
    const expectedModuleItem = UpdateModuleResponse.from(moduleItem);
    const updateModuleDto: UpdateModuleDto = {
      description: moduleItem.description,
    };

    beforeEach(() => {
      repository.update.mockResolvedValueOnce({ affected: 1 });
      repository.findOne.mockResolvedValueOnce(moduleItem);
    });

    it('should update module', async () => {
      const result = await service.update(moduleItem.id, updateModuleDto);

      expect(result).toStrictEqual(expectedModuleItem);
      expect(repository.update).toHaveBeenCalled();
      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    const moduleId = 1;

    beforeEach(() => {
      repository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should delete a module', async () => {
      const result = await service.delete(moduleId);

      expect(result).toBe(true);
      expect(repository.softDelete).toHaveBeenCalled();
    });
  });
});
