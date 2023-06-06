import { Test, TestingModule } from '@nestjs/testing';
import { UserCompanyService } from './user-company.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserCompany } from './entity/user-company.entity';
import { randomUUID } from 'crypto';
import { FindUsersDto } from './dto/find-users.dto';

describe('UserCompanyService', () => {
  let service: UserCompanyService;
  const repository = {
    find: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserCompanyService,
        { provide: getRepositoryToken(UserCompany), useValue: repository },
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
      repository.find.mockResolvedValueOnce([userCompany]);
    });

    it('should return a list of users attached to a company', async () => {
      const result = await service.findUsers(userCompany.company.id);

      expect(result).toStrictEqual(expected);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    const userCompanyId = 1;

    beforeEach(() => {
      repository.delete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should deattach a user from company by deleting a UserCompany row', async () => {
      const result = await service.delete(userCompanyId);

      expect(result).toBe(true);
      expect(repository.delete).toHaveBeenCalled();
    });
  });
});
