import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserTypeService } from '../user-type/user-type.service';
import { UserType } from '../user-type/entity/user-type.entity';
import { UserController } from './user.controller';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import { NotFoundException } from '@nestjs/common';
import { ListUserResponseDto } from './dto/list-user-response.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let userTypeService: UserTypeService;

  const userRepository = {
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
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
        const result = await userController.list();

        expect(result).toStrictEqual(expected);
        expect(userRepository.find).toHaveBeenCalled();
      });

      it('should return a list of users by name or username', async () => {
        const result = await userController.list('test', 'test');

        expect(result).toStrictEqual(expected);
        expect(userRepository.find).toHaveBeenCalled();
      });
    });

    describe('Find', () => {
      describe('Sucess', () => {
        const user: User = {
          id: '0',
          name: 'test',
          userCompanies: [],
          costumerServices: [],
          tickets: [],
          type: {
            id: 0,
            description: 'test type',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date(),
            users: [],
            permissionGroups: [],
          },
          username: 'test.test',
          password: '123',
          token: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        };

        beforeEach(() => {
          userRepository.findOneOrFail.mockResolvedValueOnce(user);
        });

        it('should return a user', async () => {
          const result = await userController.find('0');

          expect(result).toStrictEqual(FindUserDto.from(user));
          expect(userRepository.findOneOrFail).toHaveBeenCalled();
        });
      });

      describe('Fail', () => {
        beforeEach(() => {
          userRepository.findOneOrFail.mockRejectedValueOnce({});
        });

        it('should throw an error', async () => {
          await expect(() => userController.find('0')).rejects.toThrow(
            NotFoundException,
          );

          expect(userRepository.findOneOrFail).toHaveBeenCalled();
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
      userCompanies: [],
      costumerServices: [],
      tickets: [],
      type: {
        id: 0,
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        users: [],
        permissionGroups: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    beforeEach(() => {
      userRepository.findOne.mockResolvedValueOnce(user);
    });

    it('should update the user ', async () => {
      const result = await userController.update('0', { name: 'test' });

      expect(result).toStrictEqual(UpdateUserResponseDto.from(user));
      expect(userRepository.update).toHaveBeenCalled();
      expect(userRepository.findOne).toHaveBeenCalled();
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
