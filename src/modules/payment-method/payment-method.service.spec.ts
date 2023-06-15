import { PaymentMethodService } from './payment-method.service';
import { PaymentMethod } from './entity/payment-method.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindPaymentMethodResponseDto } from './dto/find-payment-method-response.dto';
import { ListPaymentMethodResponseDto } from './dto/list-payment-method-response.dto';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { CreatePaymentMethodResponseDto } from './dto/create-payment-method-response.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { UpdatePaymentMethodResponseDto } from './dto/update-payment-method-response.dto';

describe('PaymentMethodService', () => {
  let service: PaymentMethodService;
  const repository = {
    findOneBy: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentMethodService,
        { provide: getRepositoryToken(PaymentMethod), useValue: repository },
      ],
    }).compile();

    service = moduleRef.get<PaymentMethodService>(PaymentMethodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find', () => {
    const paymentMethodId = 1;

    describe('success', () => {
      const paymentMethod: PaymentMethod = {
        id: paymentMethodId,
        description: 'test',
        status: true,
        installments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const expected = FindPaymentMethodResponseDto.from(paymentMethod);

      beforeAll(() => {
        repository.findOneBy.mockResolvedValueOnce(paymentMethod);
      });

      it('should find a paymentMethod by id', async () => {
        const result = await service.find(paymentMethodId);

        expect(result).toStrictEqual(expected);
        expect(repository.findOneBy).toHaveBeenCalled();
      });
    });

    describe('fail', () => {
      beforeAll(() => {
        repository.findOneBy.mockResolvedValueOnce({});
      });

      it('should return null when not finding a paymentMethod', async () => {
        const result = await service.find(paymentMethodId);

        expect(result).toBeNull();
        expect(repository.findOneBy).toHaveBeenCalled();
      });
    });
  });

  describe('List', () => {
    const paymentMethod: PaymentMethod = {
      id: 1,
      description: 'test',
      status: true,
      installments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const expected = ListPaymentMethodResponseDto.from([paymentMethod]);

    beforeAll(() => {
      repository.find.mockResolvedValueOnce([paymentMethod]);
    });

    it('should return a list of paymentMethods', async () => {
      const result = await service.list({
        description: paymentMethod.description,
      });

      expect(result).toStrictEqual(expected);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('Create', () => {
    const paymentMethod: PaymentMethod = {
      id: 1,
      description: 'test',
      status: true,
      installments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const createPaymentMethodDto: CreatePaymentMethodDto = {
      description: 'test',
    };

    const expected = CreatePaymentMethodResponseDto.from(paymentMethod);

    beforeAll(() => {
      repository.save.mockResolvedValueOnce(paymentMethod);
    });

    it('should create a paymentMethod', async () => {
      const result = await service.create(createPaymentMethodDto);

      expect(result).toStrictEqual(expected);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const paymentMethod: PaymentMethod = {
      id: 1,
      description: 'test',
      status: true,
      installments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const updatePaymentMethodDto: UpdatePaymentMethodDto = {
      description: paymentMethod.description,
    };

    const expected = UpdatePaymentMethodResponseDto.from(paymentMethod);

    beforeAll(() => {
      repository.update.mockResolvedValueOnce({ affected: 1 });
      repository.findOneBy.mockResolvedValueOnce(paymentMethod);
    });

    it('should update a paymentMethod', async () => {
      const result = await service.update(
        paymentMethod.id,
        updatePaymentMethodDto,
      );

      expect(result).toStrictEqual(expected);
      expect(repository.update).toHaveBeenCalled();
      expect(repository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    const paymentMethodId = 1;

    beforeAll(() => {
      repository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should soft delete a paymentMethod', async () => {
      const result = await service.delete(paymentMethodId);

      expect(repository.softDelete).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
