import { BlackListController } from './black-list.controller';
import { BlackList } from './entity/black-list.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindBlackListResponseDto } from './dto/find-black-list-response.dto';
import { ListBlackListResponseDto } from './dto/list-black-list-response.dto';
import { CreateBlackListDto } from './dto/create-black-list.dto';
import { CreateBlackListResponseDto } from './dto/create-black-list-response.dto';
import { UpdateBlackListDto } from './dto/update-black-list.dto';
import { UpdateBlackListResponseDto } from './dto/update-black-list-response.dto';
import { QueryBlackListDto } from './dto/query-black-list.dto';
import { Reason } from '../reason/entity/reason.entity';
import { Client } from '../../client/entity/client.entity';
import { BlackListService } from './black-list.service';

describe('BlackListController', () => {
  let controller: BlackListController;

  const getManyAndCount = jest.fn();
  const blackListItemRepository = {
    findOneOrFail: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getManyAndCount,
    })),
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };
  const reasonRepository = {
    findOneBy: jest.fn(),
  };
  const clientRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [BlackListController],
      providers: [
        BlackListService,
        {
          provide: getRepositoryToken(BlackList),
          useValue: blackListItemRepository,
        },
        {
          provide: getRepositoryToken(Client),
          useValue: clientRepository,
        },
        {
          provide: getRepositoryToken(Reason),
          useValue: reasonRepository,
        },
      ],
    }).compile();

    controller = moduleRef.get<BlackListController>(BlackListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const reason: Reason = {
    id: 1,
    title: 'test',
    details: '',
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  const client: Client = {
    id: '1',
    name: 'test',
    email: 'test',
    contracts: [],
    costumerServices: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  const blackListItem: BlackList = {
    id: 1,
    client,
    reason,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  describe('Find', () => {
    const expected = FindBlackListResponseDto.from(blackListItem);

    beforeAll(() => {
      blackListItemRepository.findOneOrFail.mockResolvedValueOnce(
        blackListItem,
      );
    });

    it('should find a black list item by id', async () => {
      const result = await controller.find(reason.id);

      expect(blackListItemRepository.findOneOrFail).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('List', () => {
    const expected = ListBlackListResponseDto.from([blackListItem], 1);
    const queryBlackListDto: QueryBlackListDto = {
      clientId: blackListItem.client.id,
      reasonId: blackListItem.reason.id,
    };

    beforeAll(() => {
      getManyAndCount.mockResolvedValueOnce([[blackListItem], 1]);
    });

    it('should return a list of black list items', async () => {
      const result = await controller.list(queryBlackListDto);

      expect(result).toStrictEqual(expected);
      expect(getManyAndCount).toHaveBeenCalled();
    });
  });

  describe('Create', () => {
    const createBlackListDto: CreateBlackListDto = {
      clientId: blackListItem.client.id,
      reasonId: blackListItem.reason.id,
    };
    const expected = CreateBlackListResponseDto.from(blackListItem);

    beforeAll(() => {
      blackListItemRepository.save.mockResolvedValueOnce(blackListItem);
      reasonRepository.findOneBy.mockResolvedValueOnce(blackListItem.reason);
      clientRepository.findOneBy.mockResolvedValueOnce(blackListItem.client);
    });

    it('should create a black list item', async () => {
      const result = await controller.create(createBlackListDto);

      expect(result).toStrictEqual(expected);
      expect(blackListItemRepository.save).toHaveBeenCalled();
      expect(reasonRepository.findOneBy).toHaveBeenCalled();
      expect(clientRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const expected = UpdateBlackListResponseDto.from(blackListItem);
    const updateBlackListDto: UpdateBlackListDto = {
      reasonId: blackListItem.reason.id,
    };

    beforeAll(() => {
      blackListItemRepository.update.mockResolvedValueOnce({ affected: 1 });
      blackListItemRepository.findOne.mockResolvedValueOnce(blackListItem);
    });

    it('should update a black list item', async () => {
      const result = await controller.update(reason.id, updateBlackListDto);

      expect(result).toStrictEqual(expected);
      expect(blackListItemRepository.update).toHaveBeenCalled();
      expect(blackListItemRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    beforeAll(() => {
      blackListItemRepository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should soft delete a reason', async () => {
      const result = await controller.delete(blackListItem.id);

      expect(blackListItemRepository.softDelete).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
