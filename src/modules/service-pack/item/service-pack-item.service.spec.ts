import { Test, TestingModule } from '@nestjs/testing';
import { ServicePackItem } from './entity/service-pack-item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServicePackItemService } from './service-pack-item.service';
import { randomUUID } from 'crypto';
import { FindServicePackItemResponseDto } from './dto/find-service-pack-item-response.dto';
import { CreateServicePackItemDto } from './dto/create-service-pack-item.dto';
import { ServicePack } from '../service/entity/service-pack.entity';
import { ServicePackItemType } from '../item-type/entity/service-pack-item-type.entity';
import { CreateServicePackItemResponseDto } from './dto/create-service-pack-item-response.dto';
import { UpdateServicePackItemDto } from './dto/update-service-pack-item.dto';
import { UpdateServicePackItemResponseDto } from './dto/update-service-pack-item-response.dto';

describe('ServicePackItemService', () => {
  let service: ServicePackItemService;

  const servicePackItemRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const servicePackRepository = {
    findOneBy: jest.fn(),
  };
  const servicePackItemTypeRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ServicePackItemService,
        {
          provide: getRepositoryToken(ServicePackItem),
          useValue: servicePackItemRepository,
        },
        {
          provide: getRepositoryToken(ServicePack),
          useValue: servicePackRepository,
        },
        {
          provide: getRepositoryToken(ServicePackItemType),
          useValue: servicePackItemTypeRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<ServicePackItemService>(ServicePackItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const servicePackItem: ServicePackItem = {
    id: 1,
    amount: 1,
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    itemType: {
      id: 1,
      description: 'TOP_PAGE',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      items: [],
    },
    servicePack: {
      id: randomUUID(),
      name: 'test',
      description: 'test',
      subscriptionPrice: 1,
      monthlyPayment: 1,
      lateFee: 1,
      monthlyFee: 1,
      duration: 1,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      items: [],
      contracts: [],
      coin: {
        id: 1,
        name: 'Real',
        acronym: 'BRL',
        status: true,
        value: 1,
        servicePacks: [],
        contracts: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
    },
  };

  describe('Find', () => {
    describe('Success', () => {
      const item = Object.assign({}, servicePackItem);
      const expected = FindServicePackItemResponseDto.from(item);

      beforeEach(() => {
        servicePackItemRepository.findOne.mockResolvedValueOnce(item);
      });

      it('should find a service pack item by id', async () => {
        const result = await service.find(item.id);

        expect(result).toStrictEqual(expected);
        expect(servicePackItemRepository.findOne).toHaveBeenCalled();
      });
    });

    describe('Fail', () => {
      beforeEach(() => {
        servicePackItemRepository.findOne.mockResolvedValueOnce({});
      });

      it('should return null for not findind the item', async () => {
        const result = await service.find(servicePackItem.id);

        expect(result).toBeNull();
        expect(servicePackItemRepository.findOne).toHaveBeenCalled();
      });
    });
  });

  describe('Create', () => {
    const createServicePackItemDto: CreateServicePackItemDto = {
      amount: 1,
      itemTypeId: 1,
      servicePackId: randomUUID(),
    };
    const expected = CreateServicePackItemResponseDto.from(servicePackItem);

    beforeEach(() => {
      servicePackRepository.findOneBy.mockResolvedValueOnce(
        servicePackItem.servicePack,
      );
      servicePackItemTypeRepository.findOneBy.mockResolvedValueOnce(
        servicePackItem.itemType,
      );
      servicePackItemRepository.save.mockResolvedValueOnce(servicePackItem);
    });

    it('should create a service pack', async () => {
      const result = await service.create(createServicePackItemDto);

      expect(result).toStrictEqual(expected);
      expect(servicePackRepository.findOneBy).toHaveBeenCalled();
      expect(servicePackItemTypeRepository.findOneBy).toHaveBeenCalled();
      expect(servicePackItemRepository.save).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const updatedServicePackItemDto: UpdateServicePackItemDto = {
      amount: 1,
    };
    const expected = UpdateServicePackItemResponseDto.from(servicePackItem);

    beforeAll(() => {
      servicePackItemRepository.update.mockResolvedValueOnce({ affected: 1 });
      servicePackItemRepository.findOne.mockResolvedValueOnce(servicePackItem);
    });

    it('should update a service pack item', async () => {
      const result = await service.update(
        servicePackItem.id,
        updatedServicePackItemDto,
      );

      expect(result).toStrictEqual(expected);
      expect(servicePackItemRepository.update).toHaveBeenCalled();
      expect(servicePackItemRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    beforeAll(() => {
      servicePackItemRepository.delete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should delete a service pack item', async () => {
      const result = await service.delete(servicePackItem.id);

      expect(result).toBe(true);
      expect(servicePackItemRepository.delete).toHaveBeenCalled();
    });
  });
});
