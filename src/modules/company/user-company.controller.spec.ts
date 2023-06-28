import { Test, TestingModule } from '@nestjs/testing';
import { UserCompanyController } from './user-company.controller';
import { UserCompanyService } from './user-company.service';
import { UserCompany } from './entity/user-company.entity';
import { randomUUID } from 'crypto';
import { FindUsersDto } from './dto/find-users.dto';
import { CreateUserCompanyResponseDto } from './dto/create-user-company-response.dto';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from './entity/company.entity';
import { User } from '../user/entity/user.entity';

describe('UserCompanyController', () => {
  let controller: UserCompanyController;

  const userCompanyRepository = {
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const companyRepository = {
    findOneBy: jest.fn(),
  };
  const userRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserCompanyController],
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

    controller = moduleRef.get<UserCompanyController>(UserCompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
        costumerServices: [],
        tickets: [],
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
        costumerServices: [],
        tickets: [],
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
