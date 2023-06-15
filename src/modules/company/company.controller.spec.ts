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
import { CompanyController } from './company.controller';
import { UserCompanyService } from './user-company.service';
import { UserCompany } from './entity/user-company.entity';
import { FindUsersDto } from './dto/find-users.dto';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { CreateUserCompanyResponseDto } from './dto/create-user-company-response.dto';
import { User } from '../user/entity/user.entity';

describe('CompanyController', () => {
  let controller: CompanyController;

  const companyRepository = {
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };
  const userCompanyRepository = {
    find: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
  };
  const userRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        CompanyService,
        UserCompanyService,
        { provide: getRepositoryToken(Company), useValue: companyRepository },
        {
          provide: getRepositoryToken(UserCompany),
          useValue: userCompanyRepository,
        },
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    }).compile();

    controller = moduleRef.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
        contracts: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const expected = FindCompanyResponseDto.from(company);

      beforeEach(() => {
        companyRepository.findOne.mockResolvedValueOnce(company);
      });

      it('should find a company by id', async () => {
        const result = await controller.find(company.id);

        expect(result).toStrictEqual(expected);
        expect(companyRepository.findOne).toHaveBeenCalled();
      });
    });

    describe('Fail', () => {
      const companyId = randomUUID();

      beforeEach(() => {
        companyRepository.findOne.mockResolvedValueOnce({});
      });

      it('should not find a company by id', async () => {
        const result = await controller.find(companyId);

        expect(result).toBeNull();
        expect(companyRepository.findOne).toHaveBeenCalled();
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
      contracts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const queryBuilderResult = {
      companies: [company],
      total: 1,
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
        companyRepository.findAndCount.mockResolvedValueOnce([
          queryBuilderResult.companies,
          queryBuilderResult.total,
        ]);
      });

      it('should return a paginated list of companies', async () => {
        const result = await controller.list(queryListCompanyDto);

        expect(result).toStrictEqual(expected);
        expect(companyRepository.findAndCount).toHaveBeenCalled();
      });
    });

    describe('CompanyStatusEnum.ACTIVE', () => {
      const queryListCompanyDto: QueryListCompanyDto = {
        page: 1,
        name: 'test',
        status: CompanyStatusEnum.ACTIVE,
      };

      beforeEach(() => {
        companyRepository.findAndCount.mockResolvedValueOnce([
          queryBuilderResult.companies,
          queryBuilderResult.total,
        ]);
      });

      it('should return a paginated list of active companies', async () => {
        const result = await controller.list(queryListCompanyDto);

        expect(result).toStrictEqual(expected);
        expect(companyRepository.findAndCount).toHaveBeenCalled();
      });
    });

    describe('CompanyStatusEnum.INACTIVE', () => {
      const queryListCompanyDto: QueryListCompanyDto = {
        page: 1,
        name: 'test',
        status: CompanyStatusEnum.INACTIVE,
      };

      beforeEach(() => {
        companyRepository.findAndCount.mockResolvedValueOnce([
          queryBuilderResult.companies,
          queryBuilderResult.total,
        ]);
      });

      it('should return a paginated list of inactive companies', async () => {
        const result = await controller.list(queryListCompanyDto);

        expect(result).toStrictEqual(expected);
        expect(companyRepository.findAndCount).toHaveBeenCalled();
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
      contracts: [],
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
      companyRepository.save.mockResolvedValueOnce(company);
    });

    it('should create a company', async () => {
      const result = await controller.create(createCompanyDto);

      expect(result).toStrictEqual(expected);
      expect(companyRepository.save).toHaveBeenCalled();
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
      contracts: [],
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
      companyRepository.update.mockResolvedValueOnce({ affected: 1 });
      companyRepository.findOne.mockResolvedValueOnce(company);
    });

    it('should update a company', async () => {
      const result = await controller.update(company.id, updateCompanyDto);

      expect(result).toStrictEqual(expected);
      expect(companyRepository.update).toHaveBeenCalled();
      expect(companyRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    const companyId = randomUUID();

    beforeEach(() => {
      companyRepository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should delete a company', async () => {
      const result = await controller.delete(companyId);

      expect(result).toBe(true);
      expect(companyRepository.softDelete).toHaveBeenCalled();
    });
  });

  describe('Find Users', () => {
    const userCompany: UserCompany = {
      id: 1,
      createdAt: new Date(),
      company: {
        id: randomUUID(),
        name: 'test',
        displayName: 'test',
        email: 'test',
        status: true,
        userCompanies: [],
        contracts: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
      user: {
        id: randomUUID(),
        name: 'test',
        username: 'test',
        password: 'test',
        token: null,
        userCompanies: [],
        type: {
          id: 1,
          description: 'test',
          users: [],
          permissionGroups: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
    };

    const expected = FindUsersDto.from([userCompany]);

    beforeEach(async () => {
      userCompanyRepository.find.mockResolvedValueOnce([userCompany]);
    });

    it('should return a list of users of a company', async () => {
      const result = await controller.findUsers(userCompany.company.id);

      expect(result).toStrictEqual(expected);
      expect(userCompanyRepository.find).toHaveBeenCalled();
    });
  });

  describe('Attach User to Company', () => {
    const userCompany: UserCompany = {
      id: 1,
      createdAt: new Date(),
      company: {
        id: randomUUID(),
        name: 'test',
        displayName: 'test',
        email: 'test',
        status: true,
        userCompanies: [],
        contracts: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
      user: {
        id: randomUUID(),
        name: 'test',
        username: 'test',
        password: 'test',
        token: null,
        type: {
          id: 1,
          description: 'test',
          permissionGroups: [],
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
        userCompanies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
    };

    const createUserCompanyDto: CreateUserCompanyDto = {
      userId: userCompany.user.id,
    };

    const expected = CreateUserCompanyResponseDto.from(userCompany);

    beforeEach(() => {
      companyRepository.findOneBy.mockResolvedValueOnce(userCompany.company);
      userRepository.findOneBy.mockResolvedValueOnce(userCompany.user);
      userCompanyRepository.save.mockResolvedValueOnce(userCompany);
    });

    it('should create a user company', async () => {
      const result = await controller.attachUser(
        userCompany.company.id,
        createUserCompanyDto,
      );

      expect(result).toStrictEqual(expected);
      expect(userRepository.findOneBy).toHaveBeenCalled();
      expect(companyRepository.findOneBy).toHaveBeenCalled();
      expect(userCompanyRepository.save).toHaveBeenCalled();
    });
  });

  describe('Delete User Company', () => {
    const userCompanyId = 1;

    beforeEach(() => {
      userCompanyRepository.delete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should delete a user company by id', async () => {
      const result = await controller.deattachUser(userCompanyId);

      expect(result).toBe(true);
      expect(userCompanyRepository.delete).toHaveBeenCalled();
    });
  });
});
