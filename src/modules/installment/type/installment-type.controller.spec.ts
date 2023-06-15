import { InstallmentTypeService } from './installment-type.service';
import { InstallmentType } from './entity/installment-type.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindInstallmentTypeResponseDto } from './dto/find-installment-type-response.dto';
import { ListInstallmentTypeResponseDto } from './dto/list-installment-type-response.dto';
import { CreateInstallmentTypeDto } from './dto/create-installment-type.dto';
import { CreateInstallmentTypeResponseDto } from './dto/create-installment-type-response.dto';
import { UpdateInstallmentTypeDto } from './dto/update-installment-type.dto';
import { UpdateInstallmentTypeResponseDto } from './dto/update-installment-type-response.dto';
import { InstallmentTypeController } from './installment-type.controller';

describe('InstallmentTypeController', () => {
  let controller: InstallmentTypeController;
  const repository = {
    findOneBy: jest.fn(),
    findOneByOrFail: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [InstallmentTypeController],
      providers: [
        InstallmentTypeService,
        { provide: getRepositoryToken(InstallmentType), useValue: repository },
      ],
    }).compile();

    controller = moduleRef.get<InstallmentTypeController>(
      InstallmentTypeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Find', () => {
    const installmentType: InstallmentType = {
      id: 1,
      description: 'test',
      status: true,
      installments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const installmentTypeExpected =
      FindInstallmentTypeResponseDto.from(installmentType);

    beforeAll(() => {
      repository.findOneByOrFail.mockResolvedValueOnce(installmentType);
    });

    it('should find a installment-type by id', async () => {
      const result = await controller.find(installmentType.id);

      expect(repository.findOneByOrFail).toHaveBeenCalled();
      expect(result).toEqual(installmentTypeExpected);
    });
  });

  describe('List', () => {
    const installmentType: InstallmentType = {
      id: 1,
      description: 'test',
      status: true,
      installments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const installmentTypeExpected = ListInstallmentTypeResponseDto.from([
      installmentType,
    ]);

    beforeAll(() => {
      repository.find.mockResolvedValueOnce([installmentType]);
    });

    it('should return a list of installment-types', async () => {
      const result = await controller.list({ description: 'test' });

      expect(repository.find).toHaveBeenCalled();
      expect(result).toStrictEqual(installmentTypeExpected);
    });
  });

  describe('Create', () => {
    const installmentType: InstallmentType = {
      id: 1,
      description: 'test',
      status: true,
      installments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const createInstallmentTypeDto: CreateInstallmentTypeDto = {
      description: 'test',
    };

    const expected = CreateInstallmentTypeResponseDto.from(installmentType);

    beforeAll(() => {
      repository.save.mockResolvedValueOnce(installmentType);
    });

    it('should create a installment-type', async () => {
      const result = await controller.create(createInstallmentTypeDto);

      expect(repository.save).toHaveBeenCalled();
      expect(result).toStrictEqual(expected);
    });
  });

  describe('Update', () => {
    const installmentType: InstallmentType = {
      id: 1,
      description: 'test',
      status: true,
      installments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const updateInstallmentTypeDto: UpdateInstallmentTypeDto = {
      description: installmentType.description,
    };

    const expected = UpdateInstallmentTypeResponseDto.from(installmentType);

    beforeAll(() => {
      repository.update.mockResolvedValueOnce({ affected: 1 });
      repository.findOneBy.mockResolvedValueOnce(installmentType);
    });

    it('should update a installment-type', async () => {
      const result = await controller.update(
        installmentType.id,
        updateInstallmentTypeDto,
      );

      expect(result).toHaveProperty('id', expected.id);
      expect(result).toHaveProperty('description', expected.description);
      expect(result).toHaveProperty('status', expected.status);
      expect(result).toHaveProperty('updatedAt');
      expect(repository.update).toHaveBeenCalled();
      expect(repository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    const installmentTypeId = 1;

    beforeAll(() => {
      repository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should soft delete a installment-type', async () => {
      const result = await controller.delete(installmentTypeId);

      expect(repository.softDelete).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
