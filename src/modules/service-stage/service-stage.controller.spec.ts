import { ServiceStageService } from './service-stage.service';
import { ServiceStage } from './entity/service-stage.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindServiceStageResponseDto } from './dto/find-service-stage-response.dto';
import { ListServiceStageResponseDto } from './dto/list-service-stage-response.dto';
import { CreateServiceStageDto } from './dto/create-service-stage.dto';
import { CreateServiceStageResponseDto } from './dto/create-service-stage-response.dto';
import { UpdateServiceStageDto } from './dto/update-service-stage.dto';
import { UpdateServiceStageResponseDto } from './dto/update-service-stage-response.dto';
import { randomBytes, randomInt } from 'crypto';
import { ServiceStageController } from './service-stage.controller';

describe('ServiceStageController', () => {
  let controller: ServiceStageController;
  const repository = {
    findOneByOrFail: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ServiceStageController],
      providers: [
        ServiceStageService,
        { provide: getRepositoryToken(ServiceStage), useValue: repository },
      ],
    }).compile();

    controller = moduleRef.get<ServiceStageController>(ServiceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Find', () => {
    const serviceStage: ServiceStage = {
      id: randomInt(10, 100),
      description: randomBytes(10).toString('hex'),
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      costumerServices: [],
    };

    const expected = FindServiceStageResponseDto.from(serviceStage);

    beforeAll(() => {
      repository.findOneByOrFail.mockResolvedValueOnce(serviceStage);
    });

    it('should find a serviceStage by id', async () => {
      const result = await controller.find(serviceStage.id);

      expect(repository.findOneByOrFail).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('List', () => {
    const serviceStage: ServiceStage = {
      id: randomInt(10, 100),
      description: randomBytes(10).toString('hex'),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      status: true,
      costumerServices: [],
    };

    const expected = ListServiceStageResponseDto.from([serviceStage]);

    beforeAll(() => {
      repository.find.mockResolvedValueOnce([serviceStage]);
    });

    it('should return a list of serviceStages', async () => {
      const result = await controller.list({
        description: serviceStage.description,
      });

      expect(repository.find).toHaveBeenCalled();
      expect(result).toStrictEqual(expected);
    });
  });

  describe('Create', () => {
    const serviceStage: ServiceStage = {
      id: randomInt(10, 100),
      description: randomBytes(10).toString('hex'),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      status: true,
      costumerServices: [],
    };
    const createServiceStageDto: CreateServiceStageDto = {
      description: randomBytes(10).toString('hex'),
    };

    const expected = CreateServiceStageResponseDto.from(serviceStage);

    beforeAll(() => {
      repository.save.mockResolvedValueOnce(serviceStage);
    });

    it('should create a serviceStage', async () => {
      const result = await controller.create(createServiceStageDto);

      expect(repository.save).toHaveBeenCalled();
      expect(result).toStrictEqual(expected);
    });
  });

  describe('Update', () => {
    const serviceStage: ServiceStage = {
      id: randomInt(10, 100),
      description: randomBytes(10).toString('hex'),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      status: true,
      costumerServices: [],
    };

    const updateServiceStageDto: UpdateServiceStageDto = {
      description: serviceStage.description,
    };

    const expected = UpdateServiceStageResponseDto.from(serviceStage);

    beforeAll(() => {
      repository.update.mockResolvedValueOnce({ affected: 1 });
      repository.findOneBy.mockResolvedValueOnce(serviceStage);
    });

    it('should update a serviceStage', async () => {
      const result = await controller.update(
        serviceStage.id,
        updateServiceStageDto,
      );

      expect(repository.update).toHaveBeenCalled();
      expect(repository.findOneBy).toHaveBeenCalled();
      expect(result).toStrictEqual(expected);
    });
  });

  describe('Delete', () => {
    const serviceStageId = 1;

    beforeAll(() => {
      repository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should soft delete a serviceStage', async () => {
      const result = await controller.delete(serviceStageId);

      expect(repository.softDelete).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
