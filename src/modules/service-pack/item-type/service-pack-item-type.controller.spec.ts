import { ServicePackItemTypeController } from './service-pack-item-type.controller';
import { ServicePackItemType } from './entity/service-pack-item-type.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindServicePackItemTypeResponseDto } from './dto/find-service-pack-item-type-response.dto';
import { ListServicePackItemTypeResponseDto } from './dto/list-service-pack-item-type-response.dto';
import { CreateServicePackItemTypeDto } from './dto/create-service-pack-item-type.dto';
import { CreateServicePackItemTypeResponseDto } from './dto/create-service-pack-item-type-response.dto';
import { UpdateServicePackItemTypeDto } from './dto/update-service-pack-item-type.dto';
import { UpdateServicePackItemTypeResponseDto } from './dto/update-service-pack-item-type-response.dto';
import { ServicePackItemTypeService } from './service-pack-item-type.service';

describe('ServicePackItemTypeController', () => {
  let controller: ServicePackItemTypeController;
  const repository = {
    findOneBy: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ServicePackItemTypeController],
      providers: [
        ServicePackItemTypeService,
        {
          provide: getRepositoryToken(ServicePackItemType),
          useValue: repository,
        },
      ],
    }).compile();

    controller = moduleRef.get<ServicePackItemTypeController>(
      ServicePackItemTypeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Find', () => {
    const servicePackItemTypeId = 0;

    describe('success', () => {
      const servicePackItemTypeExpected: ServicePackItemType = {
        id: 1,
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        items: [],
      };

      const expected = FindServicePackItemTypeResponseDto.from(
        servicePackItemTypeExpected,
      );

      beforeAll(() => {
        repository.findOneBy.mockResolvedValueOnce(servicePackItemTypeExpected);
      });

      it('should find a servicePackItemType by id', async () => {
        const result = await controller.find(servicePackItemTypeId);

        expect(repository.findOneBy).toHaveBeenCalled();
        expect(result).toStrictEqual(expected);
      });
    });

    describe('fail', () => {
      beforeAll(() => {
        repository.findOneBy.mockResolvedValueOnce({});
      });

      it('should return null when not finding a servicePackItemType', async () => {
        const result = await controller.find(servicePackItemTypeId);

        expect(repository.findOneBy).toHaveBeenCalled();
        expect(result).toBeNull();
      });
    });
  });

  describe('List', () => {
    const servicePackItemType: ServicePackItemType = {
      id: 1,
      description: 'test 1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      items: [],
    };

    const servicePackItemTypeListExpected =
      ListServicePackItemTypeResponseDto.from([servicePackItemType]);

    beforeAll(() => {
      repository.find.mockResolvedValueOnce([servicePackItemType]);
    });

    it('should return a list of servicePackItemTypes', async () => {
      const result = await controller.list({});

      expect(result).toStrictEqual(servicePackItemTypeListExpected);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('Create', () => {
    const servicePackItemType: ServicePackItemType = {
      id: 1,
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      items: [],
    };
    const createServicePackItemTypeDto: CreateServicePackItemTypeDto = {
      description: 'test',
    };

    beforeAll(() => {
      repository.save.mockResolvedValueOnce(servicePackItemType);
    });

    it('should create a servicePackItemType', async () => {
      const result = await controller.create(createServicePackItemTypeDto);

      expect(repository.save).toHaveBeenCalled();
      expect(result).toStrictEqual(
        CreateServicePackItemTypeResponseDto.from(servicePackItemType),
      );
    });
  });

  describe('Update', () => {
    const servicePackItemType: ServicePackItemType = {
      id: 1,
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      items: [],
    };

    const updateServicePackItemTypeDto: UpdateServicePackItemTypeDto = {
      description: servicePackItemType.description,
    };

    beforeAll(() => {
      repository.update.mockResolvedValueOnce({ affected: 1 });
      repository.findOneBy.mockResolvedValueOnce(servicePackItemType);
    });

    it('should update a servicePackItemType', async () => {
      const result = await controller.update(
        servicePackItemType.id,
        updateServicePackItemTypeDto,
      );

      expect(repository.update).toHaveBeenCalled();
      expect(repository.findOneBy).toHaveBeenCalled();
      expect(result).toStrictEqual(
        UpdateServicePackItemTypeResponseDto.from(servicePackItemType),
      );
    });
  });

  describe('Delete', () => {
    const servicePackItemTypeId = 1;

    beforeAll(() => {
      repository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should soft delete a servicePackItemType', async () => {
      const result = await controller.delete(servicePackItemTypeId);

      expect(repository.softDelete).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
