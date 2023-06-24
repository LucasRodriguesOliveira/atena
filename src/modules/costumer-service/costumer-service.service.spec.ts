import { Test, TestingModule } from '@nestjs/testing';
import { CostumerServiceService } from './costumer-service.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CostumerService } from './entity/costumer-service.entity';
import { Client } from '../client/entity/client.entity';
import { User } from '../user/entity/user.entity';
import { ServiceStage } from '../service-stage/entity/service-stage.entity';
import { randomBytes, randomInt, randomUUID } from 'crypto';
import { FindCostumerServiceResponseDto } from './dto/find-costumer-service-response.dto';
import { ListCostumerServiceResponseDto } from './dto/list-costumer-service-response.dto';
import { QueryCostumerServiceDto } from './dto/query-costumer-service.dto';
import { CreateCostumerServiceDto } from './dto/create-costumer-service.dto';
import { UpdateCostumerServiceDto } from './dto/update-costumer-service.dto';

describe('CostumerServiceService', () => {
  let service: CostumerServiceService;

  const getManyAndCount = jest.fn();
  const costumerServiceRepository = {
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getManyAndCount,
    })),
    findOneOrFail: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const serviceStageRepository = {
    findOneBy: jest.fn(),
  };

  const clientRepository = {
    findOneBy: jest.fn(),
  };

  const userRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CostumerServiceService,
        {
          provide: getRepositoryToken(CostumerService),
          useValue: costumerServiceRepository,
        },
        {
          provide: getRepositoryToken(Client),
          useValue: clientRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: getRepositoryToken(ServiceStage),
          useValue: serviceStageRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<CostumerServiceService>(CostumerServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const costumerService: CostumerService = {
    id: randomInt(1, 100),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
    client: {
      id: randomUUID(),
      email: randomBytes(20).toString('hex'),
      name: randomBytes(20).toString('hex'),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      contracts: [],
      costumerServices: [],
    },
    user: {
      id: randomUUID(),
      name: randomBytes(20).toString('hex'),
      password: randomBytes(20).toString('hex'),
      token: randomBytes(20).toString('hex'),
      username: randomBytes(20).toString('hex'),
      type: {
        id: randomInt(1, 10),
        description: randomBytes(20).toString('hex'),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        permissionGroups: [],
        users: [],
      },
      costumerServices: [],
      userCompanies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    },
    serviceStage: {
      id: randomInt(1, 100),
      description: randomBytes(20).toString('hex'),
      status: true,
      costumerServices: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    },
  };

  describe('Find', () => {
    const expected = FindCostumerServiceResponseDto.from(costumerService);

    beforeEach(() => {
      costumerServiceRepository.findOneOrFail.mockResolvedValueOnce(
        costumerService,
      );
    });

    it('should find a costumer service', async () => {
      const result = await service.find(costumerService.id);

      expect(result).toStrictEqual(expected);
      expect(costumerServiceRepository.findOneOrFail).toHaveBeenCalled();
    });
  });

  describe('List', () => {
    const expected = ListCostumerServiceResponseDto.from([costumerService], 1);
    const queryCostumerServiceDto: QueryCostumerServiceDto = {
      clientId: costumerService.client.id,
      serviceStageId: costumerService.serviceStage.id,
      userId: costumerService.user.id,
    };

    beforeEach(() => {
      getManyAndCount.mockResolvedValueOnce([[costumerService], 1]);
    });

    it('should return a paginated list of costumer services', async () => {
      const result = await service.list(queryCostumerServiceDto);

      expect(result).toStrictEqual(expected);
      expect(costumerServiceRepository.createQueryBuilder).toHaveBeenCalled();
      expect(getManyAndCount).toHaveBeenCalled();
    });
  });

  describe('Create', () => {
    const expected = FindCostumerServiceResponseDto.from(costumerService);
    const createCostumerServiceDto: CreateCostumerServiceDto = {
      clientId: costumerService.client.id,
      serviceStageId: costumerService.serviceStage.id,
      userId: costumerService.user.id,
    };

    beforeEach(() => {
      costumerServiceRepository.save.mockResolvedValueOnce(costumerService);
      clientRepository.findOneBy.mockResolvedValueOnce(costumerService.client);
      userRepository.findOneBy.mockResolvedValueOnce(costumerService.user);
      serviceStageRepository.findOneBy.mockResolvedValueOnce(
        costumerService.serviceStage,
      );
    });

    it('should create a costumer service', async () => {
      const result = await service.create(createCostumerServiceDto);

      expect(result).toStrictEqual(expected);
      expect(costumerServiceRepository.save).toHaveBeenCalled();
      expect(clientRepository.findOneBy).toHaveBeenCalled();
      expect(userRepository.findOneBy).toHaveBeenCalled();
      expect(serviceStageRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const expected = FindCostumerServiceResponseDto.from(costumerService);
    const updateCostumerServiceDto: UpdateCostumerServiceDto = {
      serviceStageId: costumerService.serviceStage.id,
    };

    beforeEach(() => {
      costumerServiceRepository.update.mockResolvedValueOnce({ affected: 1 });
      costumerServiceRepository.findOne.mockResolvedValueOnce(costumerService);
    });

    it('should update a costumer service', async () => {
      const result = await service.update(
        costumerService.id,
        updateCostumerServiceDto,
      );

      expect(result).toStrictEqual(expected);
      expect(costumerServiceRepository.update).toHaveBeenCalled();
      expect(costumerServiceRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    const expected = true;

    beforeEach(() => {
      costumerServiceRepository.softDelete.mockResolvedValueOnce({
        affected: 1,
      });
    });

    it('should soft delete a costumer service', async () => {
      const result = await service.delete(costumerService.id);

      expect(result).toBe(expected);
      expect(costumerServiceRepository.softDelete).toHaveBeenCalled();
    });
  });
});
