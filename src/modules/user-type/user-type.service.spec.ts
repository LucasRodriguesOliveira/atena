import { Test, TestingModule } from '@nestjs/testing';
import { UserTypeService } from './user-type.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserType } from './entity/user-type.entity';
import { FindUserTypeDto } from './dto/find-user-type.dto';
import { ListUserTypeResponse } from './dto/list-user-type-response.dto';
import { CreateUserTypeResponse } from './dto/create-user-type-response.dto';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeResponse } from './dto/update-user-type-response.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';

describe('UserTypeService', () => {
  let service: UserTypeService;
  const repository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserTypeService,
        {
          provide: getRepositoryToken(UserType),
          useValue: repository,
        },
      ],
    }).compile();

    service = moduleRef.get<UserTypeService>(UserTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const userType: UserType = {
    id: 1,
    description: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
    users: [],
    permissionGroups: [],
  };

  describe('List', () => {
    const userTypeExpected = ListUserTypeResponse.from(userType);

    beforeEach(() => {
      repository.find.mockResolvedValueOnce([userType]);
    });

    it('should return a list of user types', async () => {
      const result = await service.list();

      expect(result).toStrictEqual([userTypeExpected]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('Find', () => {
    describe('Success', () => {
      const userTypeExpected = FindUserTypeDto.from(userType);

      beforeEach(() => {
        repository.findOneBy.mockResolvedValueOnce(userType);
      });

      it('should return a user type', async () => {
        const result = await service.find(userType.id);

        expect(result).toStrictEqual(userTypeExpected);
        expect(repository.findOneBy).toHaveBeenCalled();
      });
    });

    describe('Fail', () => {
      beforeEach(() => {
        repository.findOneBy.mockResolvedValueOnce({});
      });

      it('should return null for not finding a user type', async () => {
        const result = await service.find(userType.id);

        expect(result).toBeNull();
        expect(repository.findOneBy).toHaveBeenCalled();
      });
    });
  });

  describe('Create', () => {
    const userTypeExpected = CreateUserTypeResponse.from(userType);
    const createUserTypeDto: CreateUserTypeDto = {
      description: userType.description,
    };

    beforeEach(() => {
      repository.save.mockResolvedValueOnce(userType);
    });

    it('should create successfully a user type', async () => {
      const result = await service.create(createUserTypeDto);

      expect(result).toStrictEqual(userTypeExpected);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const userTypeExpected = UpdateUserTypeResponse.from(userType);
    const updateUserTypeDto: UpdateUserTypeDto = {
      description: userType.description,
    };

    beforeEach(() => {
      repository.findOneBy.mockResolvedValueOnce(userType);
    });

    it('should update the user type', async () => {
      const result = await service.update(userType.id, updateUserTypeDto);

      expect(result).toStrictEqual(userTypeExpected);
      expect(repository.update).toHaveBeenCalled();
      expect(repository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    beforeEach(() => {
      repository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should delete the user type', async () => {
      const result = await service.delete(userType.id);

      expect(result).toBe(true);
      expect(repository.softDelete).toHaveBeenCalled();
    });
  });
});
