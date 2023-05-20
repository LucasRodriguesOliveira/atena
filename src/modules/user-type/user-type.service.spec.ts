import { Test, TestingModule } from '@nestjs/testing';
import { UserTypeService } from './user-type.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserType } from './entity/user-type.entity';
import { repositoryMockFactory } from '../../../test/utils/repository-mock-factory';
import { MockType } from '../../../test/utils/mock-type';
import { Repository } from 'typeorm';

describe('UserTypeService', () => {
  let service: UserTypeService;
  let repository: MockType<Repository<UserType>>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserTypeService,
        {
          provide: getRepositoryToken(UserType),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = moduleRef.get<UserTypeService>(UserTypeService);
    repository = moduleRef.get<MockType<Repository<UserType>>>(
      getRepositoryToken(UserType),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Read', () => {
    const userType = {
      id: 0,
      description: 'test',
    };

    const userTypeList = [
      userType,
      {
        id: 1,
        description: 'test 2',
      },
    ];

    beforeEach(() => {
      repository.findOneBy.mockClear();
      repository.find.mockClear();
      repository.findOneBy.mockImplementationOnce(() => userType);
      repository.find.mockImplementationOnce(() => userTypeList);
    });

    it('should return a list of user types', async () => {
      const result = await service.list();

      expect(result).toHaveLength(2);
      expect(result).toBe(userTypeList);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return a user type', async () => {
      const result = await service.find(0);

      expect(result).toBe(userType);
      expect(repository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('Create', () => {
    const userType: UserType = {
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      description: 'test',
      users: [],
    };

    beforeEach(() => {
      repository.save.mockClear();
      repository.save.mockImplementationOnce(() => userType);
    });

    it('should create successfully a user type', async () => {
      const result = await service.create({
        description: 'test',
      });

      expect(result).toBe(userType);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const userType: UserType = {
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      description: 'test',
      users: [],
    };

    beforeEach(() => {
      repository.findOneBy.mockClear();
      repository.update.mockClear();
      repository.findOneBy.mockImplementationOnce(() => userType);
    });

    it('should update the user type', async () => {
      const result = await service.update(0, { description: 'test' });

      expect(result).toBe(userType);
      expect(repository.update).toHaveBeenCalled();
      expect(repository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    const userTypeId = 0;
    beforeEach(() => {
      repository.softDelete.mockClear();
      repository.softDelete.mockImplementationOnce(() => ({
        affected: 1,
      }));
    });

    it('should delete the user type', async () => {
      const result = await service.delete(userTypeId);

      expect(result).toBeTruthy();
      expect(repository.softDelete).toHaveBeenCalled();
    });
  });
});
