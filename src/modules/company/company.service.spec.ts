import { randomUUID } from 'crypto';
import { CompanyService } from './company.service';
import { Company } from './entity/company.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindCompanyResponseDto } from './dto/find-company-response.dto';
import { PaginatedResult } from '../../shared/paginated-result.interface';
import { ListCompanyResponseDto } from './dto/list-company-response.dto';
import { QueryListCompanyDto } from './dto/query-list-company.dto';
import { CompanyStatusEnum } from './type/company-status.enum';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateCompanyResponseDto } from './dto/create-company-response.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateCompanyResponseDto } from './dto/update-company-response.dto';

describe('CompanyService', () => {
  let service: CompanyService;

  const repository = {
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        { provide: getRepositoryToken(Company), useValue: repository },
      ],
    }).compile();

    service = moduleRef.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find', () => {
    describe('Sucess', () => {
      const company: Company = {
        id: randomUUID(),
        name: 'test',
        displayName: 'test',
        email: 'test',
        status: true,
        userCompanies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const expected = FindCompanyResponseDto.from(company);

      beforeEach(() => {
        repository.findOne.mockResolvedValueOnce(company);
      });

      it('should find a company by id', async () => {
        const result = await service.find(company.id);

        expect(result).toStrictEqual(expected);
        expect(repository.findOne).toHaveBeenCalled();
      });
    });

    describe('Fail', () => {
      const companyId = randomUUID();

      beforeEach(() => {
        repository.findOne.mockResolvedValueOnce({});
      });

      it('should not find a company by id', async () => {
        const result = await service.find(companyId);

        expect(result).toBeNull();
        expect(repository.findOne).toHaveBeenCalled();
      });
    });
  });

  describe('List', () => {
    const company: Company = {
      id: randomUUID(),
      name: 'test',
      displayName: 'test',
      email: 'test',
      status: true,
      userCompanies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const queryBuilderResult = {
      companies: [company],
      count: 1,
    };

    const expected: PaginatedResult<ListCompanyResponseDto> =
      ListCompanyResponseDto.from(queryBuilderResult);

    describe('CompanyStatusEnum.BOTH', () => {
      const queryListCompanyDto: QueryListCompanyDto = {
        page: 1,
        name: 'test',
        status: CompanyStatusEnum.BOTH,
      };

      beforeEach(() => {
        repository.findAndCount.mockResolvedValueOnce([
          queryBuilderResult.companies,
          queryBuilderResult.count,
        ]);
      });

      it('should return a paginated list of companies', async () => {
        const result = await service.list(queryListCompanyDto);

        expect(result).toStrictEqual(expected);
        expect(repository.findAndCount).toHaveBeenCalled();
      });
    });

    describe('CompanyStatusEnum.ACTIVE', () => {
      const queryListCompanyDto: QueryListCompanyDto = {
        page: 1,
        name: 'test',
        status: CompanyStatusEnum.ACTIVE,
      };

      beforeEach(() => {
        repository.findAndCount.mockResolvedValueOnce([
          queryBuilderResult.companies,
          queryBuilderResult.count,
        ]);
      });

      it('should return a paginated list of active companies', async () => {
        const result = await service.list(queryListCompanyDto);

        expect(result).toStrictEqual(expected);
        expect(repository.findAndCount).toHaveBeenCalled();
      });
    });

    describe('CompanyStatusEnum.INACTIVE', () => {
      const queryListCompanyDto: QueryListCompanyDto = {
        page: 1,
        name: 'test',
        status: CompanyStatusEnum.INACTIVE,
      };

      beforeEach(() => {
        repository.findAndCount.mockResolvedValueOnce([
          queryBuilderResult.companies,
          queryBuilderResult.count,
        ]);
      });

      it('should return a paginated list of inactive companies', async () => {
        const result = await service.list(queryListCompanyDto);

        expect(result).toStrictEqual(expected);
        expect(repository.findAndCount).toHaveBeenCalled();
      });
    });
  });

  describe('Create', () => {
    const company: Company = {
      id: randomUUID(),
      name: 'test',
      displayName: 'test',
      email: 'test',
      status: true,
      userCompanies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const createCompanyDto: CreateCompanyDto = {
      name: 'test',
      displayName: 'test',
      email: 'test',
    };

    const expected = CreateCompanyResponseDto.from(company);

    beforeEach(() => {
      repository.save.mockResolvedValueOnce(company);
    });

    it('should create a company', async () => {
      const result = await service.create(createCompanyDto);

      expect(result).toStrictEqual(expected);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const company: Company = {
      id: randomUUID(),
      name: 'test',
      displayName: 'test',
      email: 'test',
      status: true,
      userCompanies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const updateCompanyDto: UpdateCompanyDto = {
      name: 'test',
      displayName: 'test',
      email: 'test',
    };

    const expected = UpdateCompanyResponseDto.from(company);

    beforeEach(() => {
      repository.update.mockResolvedValueOnce({ affected: 1 });
      repository.findOne.mockResolvedValueOnce(company);
    });

    it('should update a company', async () => {
      const result = await service.update(company.id, updateCompanyDto);

      expect(result).toStrictEqual(expected);
      expect(repository.update).toHaveBeenCalled();
      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    const companyId = randomUUID();

    beforeEach(() => {
      repository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should delete a company', async () => {
      const result = await service.delete(companyId);

      expect(result).toBe(true);
      expect(repository.softDelete).toHaveBeenCalled();
    });
  });
});
