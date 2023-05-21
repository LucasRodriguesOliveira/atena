import { MockType } from '../../../test/utils/mock-type';
import { UserTypeController } from './user-type.controller';
import { UserTypeService } from './user-type.service';
import { Repository } from 'typeorm';
import { UserType } from './entity/user-type.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '../../../test/utils/repository-mock-factory';
import { UpdateUserTypeResponse } from './dto/update-user-type-response.dto';
import { CreateUserTypeResponse } from './dto/create-user-type-response.dto';

describe('UserTypeController', () => {
  let controller: UserTypeController;
  let service: UserTypeService;
  let repository: MockType<Repository<UserType>>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserTypeController],
      providers: [
        UserTypeService,
        {
          provide: getRepositoryToken(UserType),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    controller = moduleRef.get<UserTypeController>(UserTypeController);
    service = moduleRef.get<UserTypeService>(UserTypeService);
    repository = moduleRef.get<MockType<Repository<UserType>>>(
      getRepositoryToken(UserType),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
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
      const result = await controller.list();

      expect(result).toHaveLength(2);
      expect(result).toBe(userTypeList);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('Create', () => {
    const userType: CreateUserTypeResponse = {
      id: 0,
      createdAt: new Date(),
      description: 'test',
    };

    beforeEach(() => {
      repository.save.mockClear();
      repository.save.mockImplementationOnce(() => userType);
    });

    it('should create successfully a user type', async () => {
      const result = await controller.create({
        description: 'test',
      });

      expect(result).toStrictEqual(userType);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const userType: UpdateUserTypeResponse = {
      id: 0,
      description: 'test',
    };

    beforeEach(() => {
      repository.findOneBy.mockClear();
      repository.update.mockClear();
      repository.findOneBy.mockImplementationOnce(() => userType);
    });

    it('should update the user type', async () => {
      const result = await controller.update(0, { description: 'test' });

      expect(result).toStrictEqual(userType);
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
      const result = await controller.delete(userTypeId);

      expect(result).toBeTruthy();
      expect(repository.softDelete).toHaveBeenCalled();
    });
  });
});
