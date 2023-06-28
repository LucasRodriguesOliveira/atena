import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from './entity/coin.entity';
import { Repository } from 'typeorm';
import { FindCoinResponseDto } from './dto/find-coin-response.dto';
import { ListCoinResponseDto } from './dto/list-coin-response.dto';
import { CreateCoinDto } from './dto/create-coin.dto';
import { CreateCoinResponseDto } from './dto/create-coin-response.dto';
import { UpdateCoinDto } from './dto/update-coin.dto';
import { UpdateCoinResponseDto } from './dto/update-coin-response.dto';

@Injectable()
export class CoinService {
  constructor(
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
  ) {}

  public async find(coinId: number): Promise<FindCoinResponseDto | null> {
    const coin = await this.coinRepository.findOneBy({ id: coinId });

    if (Object.keys(coin).length === 0) {
      return null;
    }

    return FindCoinResponseDto.from(coin);
  }

  public async list(): Promise<ListCoinResponseDto[]> {
    const coins = await this.coinRepository.find({
      select: ['id', 'name', 'acronym'],
    });

    return ListCoinResponseDto.from(coins);
  }

  public async create(
    createCoinDto: CreateCoinDto,
  ): Promise<CreateCoinResponseDto> {
    const coin = await this.coinRepository.save(createCoinDto);

    return CreateCoinResponseDto.from(coin);
  }

  public async update(
    coinId: number,
    updateCoinDto: UpdateCoinDto,
  ): Promise<UpdateCoinResponseDto> {
    if (Object.keys(updateCoinDto).length === 0) {
      throw new BadRequestException('No data sent to update Coin');
    }

    await this.coinRepository.update({ id: coinId }, { ...updateCoinDto });

    const coin = await this.coinRepository.findOneBy({ id: coinId });

    return UpdateCoinResponseDto.from(coin);
  }

  public async delete(coinId: number): Promise<boolean> {
    const { affected } = await this.coinRepository.softDelete({ id: coinId });

    return affected > 0;
  }
}
