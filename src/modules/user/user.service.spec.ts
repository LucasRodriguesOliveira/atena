import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserTypeService } from '../user-type/user-type.service';
import { UserType } from '../user-type/entity/user-type.entity';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import { ListUserResponseDto } from './dto/list-user-response.dto';

describe('UserService', () => {
  let userService: UserService;
  let userTypeService: UserTypeService;

  const userRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findOneBy: jest.fn(),
    softDelete: jest.fn(),
  };
  const userTypeRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserTypeService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: getRepositoryToken(UserType), useValue: userTypeRepository },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userTypeService = moduleRef.get<UserTypeService>(UserTypeService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userTypeService).toBeDefined();
  });

  describe('Read', () => {
    describe('List', () => {
      const user: User = {
        id: '0',
        name: 'test',
        type: {
          id: 0,
          description: 'test type',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
          users: [],
          permissionGroups: [],
        },
        userCompanies: [],
        costumerServices: [],
        tickets: [],
        username: 'test.test',
        password: '123',
        token: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const expected = ListUserResponseDto.from([user]);

      beforeEach(() => {
        userRepository.find.mockResolvedValueOnce([user]);
      });

      it('should return a list of users', async () => {
        const result = await userService.list({});

        expect(result).toStrictEqual(expected);
        expect(userRepository.find).toHaveBeenCalled();
      });

      it('should return a list of users by name or username', async () => {
        const result = await userService.list({
          name: 'test',
          username: 'test',
        });

        expect(result).toStrictEqual(expected);
        expect(userRepository.find).toHaveBeenCalled();
      });
    });

    describe('Find', () => {
      describe('Sucess', () => {
        const user: User = {
          id: '0',
          name: 'test',
          type: {
            id: 0,
            description: 'test type',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date(),
            users: [],
            permissionGroups: [],
          },
          userCompanies: [],
          costumerServices: [],
          tickets: [],
          username: 'test.test',
          password: '123',
          token: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        };

        beforeEach(() => {
          userRepository.findOne.mockResolvedValueOnce(user);
        });

        it('should return a user', async () => {
          const result = await userService.find('0');

          expect(result).toStrictEqual(FindUserDto.from(user));
          expect(userRepository.findOne).toHaveBeenCalled();
        });

        it('should return a user by username', async () => {
          const result = await userService.findByUsername('test');

          expect(result).toBe(user);
          expect(userRepository.findOne).toHaveBeenCalled();
        });
      });

      describe('Fail', () => {
        beforeEach(() => {
          userRepository.findOne.mockResolvedValueOnce({});
        });

        it('should return null', async () => {
          const result = await userService.find('0');

          expect(result).toBeNull();
          expect(userRepository.findOne).toHaveBeenCalled();
        });
      });
    });
  });

  describe('Create', () => {
    const userType = {
      id: 0,
      description: 'string',
    };

    const user = {
      id: '0',
      name: 'test',
      password: '123',
      type: userType,
    };

    beforeEach(() => {
      userRepository.save.mockResolvedValueOnce(user);
      userTypeRepository.findOneBy.mockResolvedValueOnce(userType);
    });

    it('should create successfully a user ', async () => {
      const result = await userService.create({
        name: 'test',
        password: '123',
        username: 'test',
        userTypeId: 0,
      });

      expect(result).toBe(user);
      expect(userRepository.save).toHaveBeenCalled();
      expect(userTypeRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const userType: UserType = {
      id: 0,
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      users: [],
      permissionGroups: [],
    };

    const user: User = {
      id: '0',
      name: 'test',
      password: 'test',
      username: 'test',
      token: null,
      userCompanies: [],
      costumerServices: [],
      tickets: [],
      type: userType,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const expectedUser = UpdateUserResponseDto.from(user);

    beforeAll(() => {
      userRepository.findOne.mockResolvedValue(user);
      userRepository.update.mockResolvedValue({ affected: 1 });
      userTypeRepository.findOneBy.mockResolvedValue(userType);
    });

    it('should update the user ', async () => {
      const result = await userService.update('0', { name: 'test' });

      expect(result).toStrictEqual(expectedUser);
      expect(userRepository.update).toHaveBeenCalled();
      expect(userRepository.findOne).toHaveBeenCalled();
      expect(userTypeRepository.findOneBy).toHaveBeenCalled();
    });

    it('should update the user token', async () => {
      const result = await userService.updateToken('0', 'test');

      expect(result).toStrictEqual(expectedUser);
      expect(userRepository.update).toHaveBeenCalled();
      expect(userRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    const userId = '0';
    beforeEach(() => {
      userRepository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should delete the user ', async () => {
      const result = await userService.delete(userId);

      expect(result).toBe(true);
      expect(userRepository.softDelete).toHaveBeenCalled();
    });
  });
});
