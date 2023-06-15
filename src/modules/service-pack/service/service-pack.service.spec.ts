import { Test, TestingModule } from '@nestjs/testing';
import { ServicePackService } from './service-pack.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServicePack } from './entity/service-pack.entity';
import { randomUUID } from 'crypto';
import { FindServicePackResponseDto } from './dto/find-service-pack-response.dto';
import { ListServicePackResponseDto } from './dto/list-service-pack-response.dto';
import { QueryListServicePackDto } from './dto/query-list-service-pack.dto';
import { CreateServicePackDto } from './dto/create-service-pack.dto';
import { CreateServicePackResponseDto } from './dto/create-service-pack-response.dto';
import { UpdateServicePackDto } from './dto/update-service-pack.dto';
import { UpdateServicePackResponseDto } from './dto/update-service-pack-response.dto';
import { Coin } from '../../coin/entity/coin.entity';

describe('ServicePackService', () => {
  let service: ServicePackService;
  const servicePackRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findOneBy: jest.fn(),
    softDelete: jest.fn(),
    create: jest.fn(),
  };
  const coinRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ServicePackService,
        {
          provide: getRepositoryToken(ServicePack),
          useValue: servicePackRepository,
        },
        {
          provide: getRepositoryToken(Coin),
          useValue: coinRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<ServicePackService>(ServicePackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find', () => {
    describe('Sucess', () => {
      const servicePack: ServicePack = {
        id: randomUUID(),
        name: 'test',
        description: 'test',
        duration: 1,
        subscriptionPrice: 1.0,
        monthlyPayment: 1.0,
        lateFee: 1.0,
        monthlyFee: 1.0,
        status: true,
        coin: {
          id: 1,
          name: 'Real',
          acronym: 'BRL',
          status: true,
          value: 0.2,
          servicePacks: [],
          contracts: [],
          installments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
        contracts: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        items: [],
      };

      const expected = FindServicePackResponseDto.from(servicePack);

      beforeEach(() => {
        servicePackRepository.findOne.mockResolvedValueOnce(servicePack);
      });

      it('should find a service pack by id', async () => {
        const result = await service.find(servicePack.id);

        expect(result).toStrictEqual(expected);
        expect(servicePackRepository.findOne).toHaveBeenCalled();
      });
    });

    describe('Fail', () => {
      const servicePackId = randomUUID();

      beforeEach(() => {
        servicePackRepository.findOne.mockResolvedValueOnce({});
      });

      it('should return null for not finding the service pack', async () => {
        const result = await service.find(servicePackId);

        expect(result).toBeNull();
        expect(servicePackRepository.findOne).toHaveBeenCalled();
      });
    });
  });

  describe('List', () => {
    const servicePack: ServicePack = {
      id: randomUUID(),
      name: 'test',
      description: 'test',
      duration: 1,
      subscriptionPrice: 1.0,
      monthlyPayment: 1.0,
      lateFee: 1.0,
      monthlyFee: 1.0,
      status: true,
      coin: {
        id: 1,
        name: 'Real',
        acronym: 'BRL',
        status: true,
        value: 0.2,
        servicePacks: [],
        contracts: [],
        installments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
      contracts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      items: [],
    };

    const expected = ListServicePackResponseDto.from([servicePack]);

    const queryListServicePackDto: QueryListServicePackDto = {
      name: 'test',
    };

    beforeEach(() => {
      servicePackRepository.find.mockResolvedValueOnce([servicePack]);
    });

    it('should return a list of service packs', async () => {
      const result = await service.list(queryListServicePackDto);

      expect(result).toStrictEqual(expected);
      expect(servicePackRepository.find).toHaveBeenCalled();
    });
  });

  describe('Create', () => {
    const servicePack: ServicePack = {
      id: randomUUID(),
      name: 'test',
      description: 'test',
      duration: 1,
      subscriptionPrice: 1.0,
      monthlyPayment: 1.0,
      lateFee: 1.0,
      monthlyFee: 1.0,
      status: true,
      coin: {
        id: 1,
        name: 'Real',
        acronym: 'BRL',
        status: true,
        value: 0.2,
        servicePacks: [],
        contracts: [],
        installments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
      contracts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      items: [],
    };

    const createServicePackDto: CreateServicePackDto = {
      name: 'test',
      description: 'test',
      duration: 1,
      subscriptionPrice: 1,
      monthlyPayment: 1,
      lateFee: 1,
      monthlyFee: 1,
      coinId: 1,
    };

    const expected = CreateServicePackResponseDto.from(servicePack);

    beforeEach(() => {
      servicePackRepository.save.mockResolvedValueOnce(servicePack);
      servicePackRepository.create.mockReturnValueOnce(servicePack);
    });

    it('should create a service pack', async () => {
      const result = await service.create(createServicePackDto);

      expect(result).toStrictEqual(expected);
      expect(servicePackRepository.save).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const servicePack: ServicePack = {
      id: randomUUID(),
      name: 'test',
      description: 'test',
      duration: 1,
      subscriptionPrice: 1.0,
      monthlyPayment: 1.0,
      lateFee: 1.0,
      monthlyFee: 1.0,
      status: true,
      coin: {
        id: 1,
        name: 'Real',
        acronym: 'BRL',
        status: true,
        value: 0.2,
        servicePacks: [],
        contracts: [],
        installments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
      contracts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      items: [],
    };

    const updateServicePackDto: UpdateServicePackDto = {
      name: 'test',
    };

    const expected = UpdateServicePackResponseDto.from(servicePack);

    beforeEach(() => {
      servicePackRepository.update.mockResolvedValueOnce({ affected: 1 });
      servicePackRepository.findOne.mockResolvedValueOnce(servicePack);
      coinRepository.findOneBy.mockResolvedValueOnce(servicePack.coin);
      servicePackRepository.create.mockReturnValueOnce(servicePack);
    });

    it('should update a service pack', async () => {
      const result = await service.update(servicePack.id, updateServicePackDto);

      expect(result).toStrictEqual(expected);
      expect(servicePackRepository.update).toHaveBeenCalled();
      expect(servicePackRepository.findOne).toHaveBeenCalled();
      expect(coinRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    const servicePackId = randomUUID();

    beforeEach(() => {
      servicePackRepository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should delete a service pack', async () => {
      const result = await service.delete(servicePackId);

      expect(result).toBe(true);
      expect(servicePackRepository.softDelete).toHaveBeenCalled();
    });
  });
});
