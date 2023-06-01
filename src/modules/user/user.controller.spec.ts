import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserTypeService } from '../user-type/user-type.service';
import { UserType } from '../user-type/entity/user-type.entity';
import { UserController } from './user.controller';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import { HttpException } from '@nestjs/common';

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
    describe('List', () => {
      const userList = [
        { id: 1, name: 'test 1' },
        { id: 2, name: 'test 2' },
      ];

      beforeEach(() => {
        userRepository.find.mockResolvedValueOnce(userList);
      });

      it('should return a list of users', async () => {
        const result = await userController.list();

        expect(result).toHaveLength(2);
        expect(result).toBe(userList);
        expect(userRepository.find).toHaveBeenCalled();
      });

      it('should return a list of users by name or username', async () => {
        const result = await userController.list('test', 'test');

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
          const result = await userController.find('0');

          expect(result).toStrictEqual(FindUserDto.from(user));
          expect(userRepository.findOne).toHaveBeenCalled();
        });
      });

      describe('Fail', () => {
        beforeEach(() => {
          userRepository.findOne.mockResolvedValueOnce({});
        });

        it('should throw an error', async () => {
          await expect(() => userController.find('0')).rejects.toThrow(
            HttpException,
          );

          expect(userRepository.findOne).toHaveBeenCalled();
        });
      });
    });
  });

  describe('Update', () => {
    const user: User = {
      id: '0',
      name: 'test',
      username: 'test',
      password: 'test',
      token: null,
      type: {
        id: 0,
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        users: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    beforeEach(() => {
      userRepository.findOneBy.mockResolvedValueOnce(user);
    });

    it('should update the user ', async () => {
      const result = await userController.update('0', { name: 'test' });

      expect(result).toStrictEqual(UpdateUserResponseDto.from(user));
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
