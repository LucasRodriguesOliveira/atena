import { CoinService } from './coin.service';
import { Coin } from './entity/coin.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindCoinResponseDto } from './dto/find-coin-response.dto';
import { ListCoinResponseDto } from './dto/list-coin-response.dto';
import { CreateCoinDto } from './dto/create-coin.dto';
import { CreateCoinResponseDto } from './dto/create-coin-response.dto';
import { UpdateCoinDto } from './dto/update-coin.dto';
import { UpdateCoinResponseDto } from './dto/update-coin-response.dto';
import { CoinController } from './coin.controller';
import { HttpException } from '@nestjs/common';

describe('CoinService', () => {
  let controller: CoinController;
  const repository = {
    findOneBy: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CoinController],
      providers: [
        CoinService,
        { provide: getRepositoryToken(Coin), useValue: repository },
      ],
    }).compile();

    controller = moduleRef.get<CoinController>(CoinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Find', () => {
    const coinId = 0;

    describe('success', () => {
      const coin: Coin = {
        id: 1,
        name: 'test',
        acronym: 'test',
        status: true,
        value: 1,
        servicePacks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const coinExpected = FindCoinResponseDto.from(coin);

      beforeAll(() => {
        repository.findOneBy.mockResolvedValueOnce(coin);
      });

      it('should find a coin by id', async () => {
        const result = await controller.find(coinId);

        expect(repository.findOneBy).toHaveBeenCalled();
        expect(result).toEqual(coinExpected);
      });
    });

    describe('fail', () => {
      beforeAll(() => {
        repository.findOneBy.mockResolvedValueOnce({});
      });

      it('should return null when not finding a coin', async () => {
        await expect(() => controller.find(coinId)).rejects.toThrow(
          HttpException,
        );

        expect(repository.findOneBy).toHaveBeenCalled();
      });
    });
  });

  describe('List', () => {
    const coin: Coin = {
      id: 1,
      name: 'test',
      acronym: 'test',
      status: true,
      value: 1,
      servicePacks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const coinExpected = ListCoinResponseDto.from([coin]);

    beforeAll(() => {
      repository.find.mockResolvedValueOnce([coin]);
    });

    it('should return a list of coins', async () => {
      const result = await controller.list();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toStrictEqual(coinExpected);
    });
  });

  describe('Create', () => {
    const coin: Coin = {
      id: 1,
      name: 'test',
      acronym: 'test',
      status: true,
      value: 1,
      servicePacks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const createCoinDto: CreateCoinDto = {
      name: 'test',
      acronym: 'test',
      value: 1,
    };

    const expected = CreateCoinResponseDto.from(coin);

    beforeAll(() => {
      repository.save.mockResolvedValueOnce(coin);
    });

    it('should create a coin', async () => {
      const result = await controller.create(createCoinDto);

      expect(repository.save).toHaveBeenCalled();
      expect(result).toStrictEqual(expected);
    });
  });

  describe('Update', () => {
    const coin: Coin = {
      id: 1,
      name: 'test',
      acronym: 'test',
      status: true,
      value: 1,
      servicePacks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const updateCoinDto: UpdateCoinDto = {
      name: coin.name,
    };

    const expected = UpdateCoinResponseDto.from(coin);

    beforeAll(() => {
      repository.update.mockResolvedValueOnce({ affected: 1 });
      repository.findOneBy.mockResolvedValueOnce(coin);
    });

    it('should update a coin', async () => {
      const result = await controller.update(coin.id, updateCoinDto);

      expect(repository.update).toHaveBeenCalled();
      expect(repository.findOneBy).toHaveBeenCalled();
      expect(result).toStrictEqual(expected);
    });
  });

  describe('Delete', () => {
    const coinId = 1;

    beforeAll(() => {
      repository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should soft delete a coin', async () => {
      const result = await controller.delete(coinId);

      expect(repository.softDelete).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
