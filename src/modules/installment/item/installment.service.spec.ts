import { Test, TestingModule } from '@nestjs/testing';
import { InstallmentService } from './installment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Installment } from './entity/installment.entity';
import { Contract } from '../../contract/entity/contract.entity';
import { InstallmentType } from '../type/entity/installment-type.entity';
import { PaymentMethod } from '../../payment-method/entity/payment-method.entity';
import { Coin } from '../../coin/entity/coin.entity';
import { Client } from '../../client/entity/client.entity';
import { randomInt, randomUUID } from 'crypto';
import { Company } from '../../company/entity/company.entity';
import { ServicePack } from '../../service-pack/service/entity/service-pack.entity';
import { FindInstallmentResponseDto } from './dto/find-installment-respose.dto';
import { ListInstallmentResponseDto } from './dto/list-installment-response.dto';
import { QueryInstallmentDto } from './dto/query-installment.dto';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { CreateInstallmentResponseDto } from './dto/create-installment-response.dto';
import { UpdateInstallmentResponseDto } from './dto/update-installment.response.dto';

describe('InstallmentService', () => {
  let installmentService: InstallmentService;

  const getManyAndCount = jest.fn();
  const installmentRepository = {
    findOneOrFail: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount,
    })),
    save: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
  };
  const contractRepository = {
    findOne: jest.fn(),
  };
  const installmentTypeRepository = {
    findOneBy: jest.fn(),
  };
  const paymentMethodRepository = {
    findOneBy: jest.fn(),
  };
  const coinRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        InstallmentService,
        {
          provide: getRepositoryToken(Installment),
          useValue: installmentRepository,
        },
        {
          provide: getRepositoryToken(Contract),
          useValue: contractRepository,
        },
        {
          provide: getRepositoryToken(InstallmentType),
          useValue: installmentTypeRepository,
        },
        {
          provide: getRepositoryToken(PaymentMethod),
          useValue: paymentMethodRepository,
        },
        {
          provide: getRepositoryToken(Coin),
          useValue: coinRepository,
        },
      ],
    }).compile();

    installmentService = moduleRef.get<InstallmentService>(InstallmentService);
  });

  it('should be defined', () => {
    expect(installmentService).toBeDefined();
  });

  const createdAt: Date = new Date();
  const updatedAt: Date = new Date();
  const deletedAt: Date = new Date();

  const client: Client = {
    id: randomUUID(),
    name: 'test',
    email: 'test',
    contracts: [],
    costumerServices: [],
    tickets: [],
    createdAt,
    updatedAt,
    deletedAt,
  };

  const coin: Coin = {
    id: randomInt(1, 100),
    acronym: 'any',
    name: 'test',
    status: true,
    value: 1,
    contracts: [],
    installments: [],
    servicePacks: [],
    createdAt,
    updatedAt,
    deletedAt,
  };

  const company: Company = {
    id: randomUUID(),
    name: 'test',
    displayName: 'test',
    email: 'test@test',
    status: true,
    contracts: [],
    userCompanies: [],
    createdAt,
    updatedAt,
    deletedAt,
  };

  const servicePack: ServicePack = {
    id: randomUUID(),
    name: 'test',
    description: 'test',
    duration: 1,
    coin,
    lateFee: 1,
    monthlyFee: 1,
    subscriptionPrice: 1,
    monthlyPayment: 1,
    items: [],
    contracts: [],
    status: true,
    createdAt,
    updatedAt,
    deletedAt,
  };

  const contract: Contract = {
    id: randomUUID(),
    client,
    coin,
    company,
    servicePack,
    status: true,
    lateFee: 1,
    monthlyFee: 1,
    monthlyPayment: 1,
    subscriptionPrice: 1,
    installments: [],
    expiresAt: new Date(),
    createdAt,
    updatedAt,
    deletedAt,
  };

  const installmentType: InstallmentType = {
    id: randomInt(1, 100),
    status: true,
    description: 'test',
    installments: [],
    createdAt,
    updatedAt,
    deletedAt,
  };

  const paymentMethod: PaymentMethod = {
    id: randomInt(1, 100),
    status: true,
    description: 'test',
    installments: [],
    createdAt,
    updatedAt,
    deletedAt,
  };

  const installment: Installment = {
    id: randomUUID(),
    contract,
    installmentType,
    paymentMethod,
    coin,
    expiresAt: new Date(),
    paidAt: new Date(),
    value: 1,
    valuePaid: 1,
    createdAt,
    updatedAt,
    deletedAt,
  };

  describe('Find', () => {
    const expected = FindInstallmentResponseDto.from(installment);

    beforeEach(() => {
      installmentRepository.findOneOrFail.mockResolvedValueOnce(installment);
    });

    it('should find a installment by id', async () => {
      const result = await installmentService.find(installment.id);

      expect(result).toStrictEqual(expected);
      expect(installmentRepository.findOneOrFail).toHaveBeenCalled();
    });
  });

  describe('List', () => {
    const expected = ListInstallmentResponseDto.from([installment], 1);

    const queryInstallmentDto: QueryInstallmentDto = {
      coinId: coin.id,
      companyId: company.id,
      installmentTypeId: installmentType.id,
      isExpired: true,
      isPaid: true,
      isValueDivergent: true,
      items: 10,
      page: 0,
      servicePackId: servicePack.id,
    };

    beforeEach(() => {
      getManyAndCount.mockResolvedValueOnce([[installment], 1]);
    });

    it('should return a list of installments', async () => {
      const result = await installmentService.list(queryInstallmentDto);

      expect(result).toStrictEqual(expected);
      expect(getManyAndCount).toHaveBeenCalled();
    });
  });

  describe('Create', () => {
    const createInstallmentDto: CreateInstallmentDto = {
      coinId: coin.id,
      contractId: contract.id,
      installmentTypeId: installmentType.id,
      paymentMethodId: paymentMethod.id,
      value: 1,
      expiresAt: new Date(),
    };

    const expected = CreateInstallmentResponseDto.from(installment);

    beforeEach(() => {
      installmentRepository.save.mockResolvedValueOnce(installment);
    });

    it('should create a installment', async () => {
      const result = await installmentService.create(createInstallmentDto);

      expect(result).toStrictEqual(expected);
      expect(installmentRepository.save).toHaveBeenCalled();
    });
  });

  describe('Pay', () => {
    const expected = UpdateInstallmentResponseDto.from(installment);

    beforeEach(() => {
      installmentRepository.update.mockResolvedValueOnce({ affected: 1 });
      installmentRepository.findOne.mockResolvedValueOnce(installment);
    });

    it('should pay a installment', async () => {
      const result = await installmentService.pay(installment.id, 1);

      expect(result).toStrictEqual(expected);
      expect(installmentRepository.update).toHaveBeenCalled();
      expect(installmentRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    beforeEach(() => {
      installmentRepository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should delete a installment', async () => {
      const result = await installmentService.delete(installment.id);

      expect(result).toBe(true);
      expect(installmentRepository.softDelete).toHaveBeenCalled();
    });
  });
});
