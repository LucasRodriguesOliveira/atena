import { Repository } from 'typeorm';
import { MockType } from '../../../test/utils/mock-type';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '../../../test/utils/repository-mock-factory';
import { UserTypeService } from '../user-type/user-type.service';
import { UserType } from '../user-type/entity/user-type.entity';
import { UserController } from './user.controller';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let userTypeService: UserTypeService;
  let userRepository: MockType<Repository<User>>;
  let userTypeRepository: MockType<Repository<UserType>>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserTypeService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(UserType),
          useFactory: repositoryMockFactory,
        },
      ],
      controllers: [UserController],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
    userTypeService = moduleRef.get<UserTypeService>(UserTypeService);
    userRepository = moduleRef.get<MockType<Repository<User>>>(
      getRepositoryToken(User),
    );
    userTypeRepository = moduleRef.get<MockType<Repository<UserType>>>(
      getRepositoryToken(UserType),
    );
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(userTypeRepository).toBeDefined();
    expect(userService).toBeDefined();
    expect(userTypeService).toBeDefined();
    expect(userController).toBeDefined();
  });

  describe('Read', () => {
    const user = {
      id: 0,
      name: 'test',
    };

    const userList = [
      user,
      {
        id: 1,
        name: 'test 2',
      },
    ];

    beforeEach(() => {
      userRepository.findOneBy.mockClear();
      userRepository.find.mockClear();
      userRepository.findOne.mockClear();
      userRepository.findOneBy.mockImplementationOnce(() => user);
      userRepository.find.mockImplementationOnce(() => userList);
      userRepository.findOne.mockImplementationOnce(() => user);
    });

    it('should return a list of users', async () => {
      const result = await userController.list();

      expect(result).toHaveLength(2);
      expect(result).toBe(userList);
      expect(userRepository.find).toHaveBeenCalled();
    });

    it('should return a user', async () => {
      const result = await userController.find('0');

      expect(result).toBe(user);
      expect(userRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const user = {
      id: '0',
      name: 'test',
    };

    beforeEach(() => {
      userRepository.findOneBy.mockClear();
      userRepository.update.mockClear();
      userRepository.findOneBy.mockImplementationOnce(() => user);
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
      userRepository.softDelete.mockClear();
      userRepository.softDelete.mockImplementationOnce(() => ({
        affected: 1,
      }));
    });

    it('should delete the user ', async () => {
      const result = await userController.delete(userId);

      expect(result).toBeTruthy();
      expect(userRepository.softDelete).toHaveBeenCalled();
    });
  });
});
