import { ReasonService } from './reason.service';
import { Reason } from './entity/reason.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindReasonResponseDto } from './dto/find-reason-response.dto';
import { ListReasonResponseDto } from './dto/list-reason-response.dto';
import { CreateReasonDto } from './dto/create-reason.dto';
import { CreateReasonResponseDto } from './dto/create-reason-response.dto';
import { UpdateReasonDto } from './dto/update-reason.dto';
import { UpdateReasonResponseDto } from './dto/update-reason-response.dto';
import { QueryReasonDto } from './dto/query-reason.dto';

describe('ReasonService', () => {
  let service: ReasonService;
  const repository = {
    findOneByOrFail: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ReasonService,
        { provide: getRepositoryToken(Reason), useValue: repository },
      ],
    }).compile();

    service = moduleRef.get<ReasonService>(ReasonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const reason: Reason = {
    id: 1,
    title: 'test',
    details: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  describe('Find', () => {
    const expected = FindReasonResponseDto.from(reason);

    beforeAll(() => {
      repository.findOneByOrFail.mockResolvedValueOnce(reason);
    });

    it('should find a reason by id', async () => {
      const result = await service.find(reason.id);

      expect(repository.findOneByOrFail).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('List', () => {
    const expected = ListReasonResponseDto.from([reason]);
    const queryReasonDto: QueryReasonDto = {
      title: reason.title,
    };

    beforeAll(() => {
      repository.find.mockResolvedValueOnce([reason]);
    });

    it('should return a list of reasons', async () => {
      const result = await service.list(queryReasonDto);

      expect(result).toStrictEqual(expected);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('Create', () => {
    const createReasonDto: CreateReasonDto = {
      title: reason.title,
    };
    const expected = CreateReasonResponseDto.from(reason);

    beforeAll(() => {
      repository.save.mockResolvedValueOnce(reason);
    });

    it('should create a reason', async () => {
      const result = await service.create(createReasonDto);

      expect(result).toStrictEqual(expected);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const expected = UpdateReasonResponseDto.from(reason);
    const updateReasonDto: UpdateReasonDto = {
      title: reason.title,
    };

    beforeAll(() => {
      repository.update.mockResolvedValueOnce({ affected: 1 });
      repository.findOneBy.mockResolvedValueOnce(reason);
    });

    it('should update a reason', async () => {
      const result = await service.update(reason.id, updateReasonDto);

      expect(result).toStrictEqual(expected);
      expect(repository.update).toHaveBeenCalled();
      expect(repository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    const reasonId = 1;

    beforeAll(() => {
      repository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should soft delete a reason', async () => {
      const result = await service.delete(reasonId);

      expect(repository.softDelete).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
