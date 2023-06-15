import { Test, TestingModule } from '@nestjs/testing';
import { ContractService } from './contract.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contract } from './entity/contract.entity';
import { ServicePack } from '../service-pack/service/entity/service-pack.entity';
import { Company } from '../company/entity/company.entity';
import { Client } from '../client/entity/client.entity';
import { Coin } from '../coin/entity/coin.entity';
import { FindContractResponseDto } from './dto/find-contract-response.dto';
import { randomBytes, randomInt, randomUUID } from 'crypto';
import { QueryContractDto } from './dto/query-contract.dto';
import { ContractStatus } from './type/contract-status.enum';
import { ListContractResponseDto } from './dto/list-contract-response.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import { CreateContractResponseDto } from './dto/create-contract-response.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { UpdateContractResponseDto } from './dto/update-contract-response.dto';

describe('ContractService', () => {
  let contractService: ContractService;
  const contractRepository = {
    findOneOrFail: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };
  const servicePackRepository = {
    findOneBy: jest.fn(),
  };
  const companyRepository = {
    findOneBy: jest.fn(),
  };
  const clientRepository = {
    findOneBy: jest.fn(),
  };
  const coinRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ContractService,
        {
          provide: getRepositoryToken(Contract),
          useValue: contractRepository,
        },
        {
          provide: getRepositoryToken(ServicePack),
          useValue: servicePackRepository,
        },
        {
          provide: getRepositoryToken(Company),
          useValue: companyRepository,
        },
        {
          provide: getRepositoryToken(Client),
          useValue: clientRepository,
        },
        {
          provide: getRepositoryToken(Coin),
          useValue: coinRepository,
        },
      ],
    }).compile();

    contractService = moduleRef.get<ContractService>(ContractService);
  });

  it('should be defined', () => {
    expect(contractService).toBeDefined();
  });
  const coin: Coin = {
    id: randomInt(100),
    name: randomBytes(10).toString('hex'),
    acronym: randomBytes(3).toString('hex'),
    value: randomInt(5),
    status: true,
    servicePacks: [],
    contracts: [],
    installments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  const servicePack: ServicePack = {
    id: randomUUID(),
    name: randomBytes(10).toString('hex'),
    description: randomBytes(10).toString('hex'),
    duration: randomInt(1, 12),
    subscriptionPrice: randomInt(100),
    monthlyPayment: randomInt(100),
    lateFee: randomInt(10),
    monthlyFee: randomInt(10),
    status: true,
    coin,
    contracts: [],
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  const company: Company = {
    id: randomUUID(),
    name: randomBytes(10).toString('hex'),
    displayName: randomBytes(10).toString('hex'),
    email: randomBytes(20).toString('hex'),
    status: true,
    contracts: [],
    userCompanies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  const client: Client = {
    id: randomUUID(),
    name: randomBytes(10).toString('hex'),
    email: randomBytes(20).toString('hex'),
    contracts: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  const contract: Contract = {
    id: randomUUID(),
    servicePack,
    company,
    client,
    coin,
    subscriptionPrice: randomInt(100),
    monthlyPayment: randomInt(100),
    lateFee: randomInt(10),
    monthlyFee: randomInt(10),
    expiresAt: new Date(),
    status: true,
    installments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  describe('Find', () => {
    const expected = FindContractResponseDto.from(contract);

    beforeEach(() => {
      contractRepository.findOneOrFail.mockResolvedValueOnce(contract);
    });

    it('should find a contract by id', async () => {
      const result = await contractService.find(contract.id);

      expect(result).toStrictEqual(expected);
      expect(contractRepository.findOneOrFail).toHaveBeenCalled();
    });
  });

  describe('List', () => {
    describe('ContracStatus.ACTIVE', () => {
      const queryContractDto: QueryContractDto = {
        status: ContractStatus.ACTIVE,
      };

      const expected = ListContractResponseDto.from([contract], 1);

      beforeEach(() => {
        contractRepository.findAndCount.mockResolvedValueOnce([[contract], 1]);
      });

      it('should return a list of contracts', async () => {
        const result = await contractService.list(queryContractDto);

        expect(result).toStrictEqual(expected);
        expect(contractRepository.findAndCount).toHaveBeenCalled();
      });
    });
    describe('ContracStatus.INACTIVE', () => {
      const queryContractDto: QueryContractDto = {
        status: ContractStatus.INACTIVE,
      };

      const expected = ListContractResponseDto.from([contract], 1);

      beforeEach(() => {
        contractRepository.findAndCount.mockResolvedValueOnce([[contract], 1]);
      });

      it('should return a list of contracts', async () => {
        const result = await contractService.list(queryContractDto);

        expect(result).toStrictEqual(expected);
        expect(contractRepository.findAndCount).toHaveBeenCalled();
      });
    });
  });

  describe('Create', () => {
    const createContractDto: CreateContractDto = {
      servicePackId: contract.servicePack.id,
      companyId: contract.company.id,
      clientId: contract.client.id,
      coinId: contract.coin.id,
      expiresAt: new Date(),
      subscriptionPrice: randomInt(100),
      monthlyPayment: randomInt(100),
      lateFee: randomInt(10),
      monthlyFee: randomInt(10),
    };

    const expected = CreateContractResponseDto.from(contract);

    beforeEach(() => {
      contractRepository.save.mockResolvedValueOnce(contract);
      servicePackRepository.findOneBy.mockResolvedValueOnce(
        contract.servicePack,
      );
      companyRepository.findOneBy.mockResolvedValueOnce(contract.company);
      clientRepository.findOneBy.mockResolvedValueOnce(contract.client);
      coinRepository.findOneBy.mockResolvedValueOnce(contract.coin);
    });

    it('should create a contract', async () => {
      const result = await contractService.create(createContractDto);

      expect(result).toStrictEqual(expected);
      expect(contractRepository.save).toHaveBeenCalled();
      expect(servicePackRepository.findOneBy).toHaveBeenCalled();
      expect(companyRepository.findOneBy).toHaveBeenCalled();
      expect(clientRepository.findOneBy).toHaveBeenCalled();
      expect(coinRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const updateContractDto: UpdateContractDto = {
      status: true,
    };

    const expected = UpdateContractResponseDto.from(contract);

    beforeEach(() => {
      contractRepository.update.mockResolvedValueOnce({ affected: 1 });
      contractRepository.findOne.mockResolvedValueOnce(contract);
    });

    it('should  a service pack', async () => {
      const result = await contractService.update(
        contract.id,
        updateContractDto,
      );

      expect(result).toStrictEqual(expected);
      expect(contractRepository.update).toHaveBeenCalled();
      expect(contractRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    beforeEach(() => {
      contractRepository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should  a service pack', async () => {
      const result = await contractService.delete(contract.id);

      expect(result).toBe(true);
      expect(contractRepository.softDelete).toHaveBeenCalled();
    });
  });
});
