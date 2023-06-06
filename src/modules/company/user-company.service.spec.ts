import { Test, TestingModule } from '@nestjs/testing';
import { UserCompanyService } from './user-company.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserCompany } from './entity/user-company.entity';
import { randomUUID } from 'crypto';
import { FindUsersDto } from './dto/find-users.dto';
import { CreateUserCompanyResponseDto } from './dto/create-user-company-response.dto';
import { Company } from './entity/company.entity';
import { User } from '../user/entity/user.entity';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';

describe('UserCompanyService', () => {
  let service: UserCompanyService;
  const userCompanyRepository = {
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const userRepository = {
    findOneBy: jest.fn(),
  };

  const companyRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserCompanyService,
        {
          provide: getRepositoryToken(UserCompany),
          useValue: userCompanyRepository,
        },
        {
          provide: getRepositoryToken(Company),
          useValue: companyRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<UserCompanyService>(UserCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

    const expected = FindUsersDto.from([userCompany]);

    beforeEach(() => {
      userCompanyRepository.find.mockResolvedValueOnce([userCompany]);
    });

    it('should return a list of users attached to a company', async () => {
      const result = await service.findUsers(userCompany.company.id);

      expect(result).toStrictEqual(expected);
      expect(userCompanyRepository.find).toHaveBeenCalled();
    });
  });

  describe('Create', () => {
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
      const result = await service.attachUser(
        userCompany.company.id,
        createUserCompanyDto,
      );

      expect(result).toStrictEqual(expected);
      expect(userRepository.findOneBy).toHaveBeenCalled();
      expect(companyRepository.findOneBy).toHaveBeenCalled();
      expect(userCompanyRepository.save).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    const userCompanyId = 1;

    beforeEach(() => {
      userCompanyRepository.delete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should deattach a user from company by deleting a UserCompany row', async () => {
      const result = await service.deattachUser(userCompanyId);

      expect(result).toBe(true);
      expect(userCompanyRepository.delete).toHaveBeenCalled();
    });
  });
});
