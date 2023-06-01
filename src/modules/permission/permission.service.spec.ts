import { Repository } from 'typeorm';
import { PermissionService } from './permission.service';
import { Permission } from './entity/permission.entity';
import { MockType } from 'test/utils/mock-type';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PermissionService', () => {
  let service: PermissionService;
  const repository: MockType<Repository<Permission>> = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        { provide: getRepositoryToken(Permission), useValue: repository },
      ],
    }).compile();

    service = moduleRef.get<PermissionService>(PermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find', () => {
    const permissionId = 0;
    const permissionExpected: Permission = {
      id: 0,
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    beforeAll(() => {
      repository.findOne.mockResolvedValueOnce(permissionExpected);
    });

    it('should find a permission by id', async () => {
      const result = await service.find(permissionId);

      expect(repository.findOne).toHaveBeenCalled();
      expect(result).toEqual(permissionExpected);
    });
  });
});
