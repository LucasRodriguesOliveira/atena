import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserTypeService } from '../user-type/user-type.service';
import { UserType } from '../user-type/entity/user-type.entity';
import { UserController } from './user.controller';
import { FindUserDto } from './dto/find-user.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let userTypeService: UserTypeService;

  const userRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
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
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: getRepositoryToken(UserType),
          useValue: userTypeRepository,
        },
      ],
      controllers: [UserController],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
    userTypeService = moduleRef.get<UserTypeService>(UserTypeService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userTypeService).toBeDefined();
    expect(userController).toBeDefined();
  });

  describe('Read', () => {
    const user: User = {
      id: '0',
      name: 'test',
      password: '123',
      token: null,
      username: 'test.test',
      type: {
        id: 0,
        description: 'test type',
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const userList: User[] = [
      user,
      {
        ...user,
        id: '1',
        name: 'test 2',
      },
    ];

    beforeEach(() => {
      userRepository.find.mockResolvedValueOnce(userList);
      userRepository.findOne.mockResolvedValueOnce(user);
    });

    it('should return a list of users', async () => {
      const result = await userController.list();

      expect(result).toHaveLength(2);
      expect(result).toBe(userList);
      expect(userRepository.find).toHaveBeenCalled();
    });

    it('should return a user', async () => {
      const result = await userController.find('0');

      expect(result).toStrictEqual(FindUserDto.from(user));
      expect(userRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const user = {
      id: '0',
      name: 'test',
    };

    beforeEach(() => {
      userRepository.findOneBy.mockResolvedValueOnce(user);
    });

    it('should update the user ', async () => {
      const result = await userController.update('0', { name: 'test' });

      expect(result).toBe(user);
      expect(userRepository.update).toHaveBeenCalled();
      expect(userRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    const userId = '0';
    beforeEach(() => {
      userRepository.softDelete.mockResolvedValueOnce({
        affected: 1,
      });
    });

    it('should delete the user ', async () => {
      const result = await userController.delete(userId);

      expect(result).toBeTruthy();
      expect(userRepository.softDelete).toHaveBeenCalled();
    });
  });
});
