import { Repository } from 'typeorm';
import { MockType } from '../../../test/utils/mock-type';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '../../../test/utils/repository-mock-factory';
import { UserTypeService } from '../user-type/user-type.service';
import { UserType } from '../user-type/entity/user-type.entity';

describe('UserService', () => {
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
    }).compile();

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

    it('should return a user', async () => {
      const result = await userService.find('0');

      expect(result).toBe(user);
      expect(userRepository.findOne).toHaveBeenCalled();
    });

    it('should return a user by username', async () => {
      const result = await userService.findByUsername('test');

      expect(result).toBe(user);
      expect(userRepository.findOne).toHaveBeenCalled();
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
      userRepository.save.mockClear();
      userTypeRepository.findOneBy.mockClear();
      userRepository.save.mockImplementationOnce(() => user);
      userTypeRepository.findOneBy.mockImplementationOnce(() => userType);
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
      const result = await userService.update('0', { name: 'test' });

      expect(result).toBe(user);
      expect(userRepository.update).toHaveBeenCalled();
      expect(userRepository.findOneBy).toHaveBeenCalled();
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
      userRepository.softDelete.mockClear();
      userRepository.softDelete.mockImplementationOnce(() => ({
        affected: 1,
      }));
    });

    it('should delete the user ', async () => {
      const result = await userService.delete(userId);

      expect(result).toBeTruthy();
      expect(userRepository.softDelete).toHaveBeenCalled();
    });
  });
});
