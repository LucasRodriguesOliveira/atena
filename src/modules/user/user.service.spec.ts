import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserTypeService } from '../user-type/user-type.service';
import { UserType } from '../user-type/entity/user-type.entity';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';

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
      const userList = [
        { id: 1, name: 'test 1' },
        { id: 2, name: 'test 2' },
      ];

      beforeEach(() => {
        userRepository.find.mockResolvedValueOnce(userList);
      });

      it('should return a list of users', async () => {
        const result = await userService.list({});

        expect(result).toHaveLength(2);
        expect(result).toBe(userList);
        expect(userRepository.find).toHaveBeenCalled();
      });

      it('should return a list of users by name or username', async () => {
        const result = await userService.list({
          name: 'test',
          username: 'test',
        });

        expect(result).toHaveLength(2);
        expect(result).toBe(userList);
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
          },
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
    };

    const user: User = {
      id: '0',
      name: 'test',
      password: 'test',
      username: 'test',
      token: null,
      type: userType,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    beforeAll(() => {
      userRepository.findOneBy.mockResolvedValue(user);
      userRepository.update.mockResolvedValue({ affected: 1 });
      userTypeRepository.findOneBy.mockResolvedValue(userType);
    });

    it('should update the user ', async () => {
      const result = await userService.update('0', { name: 'test' });

      expect(result).toStrictEqual(UpdateUserResponseDto.from(user));
      expect(userRepository.update).toHaveBeenCalled();
      expect(userRepository.findOneBy).toHaveBeenCalled();
      expect(userTypeRepository.findOneBy).toHaveBeenCalled();
    });

    it('should update the user token', async () => {
      const result = await userService.updateToken('0', 'test');

      expect(result).toBe(user);
      expect(userRepository.update).toHaveBeenCalled();
      expect(userRepository.findOneBy).toHaveBeenCalled();
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
