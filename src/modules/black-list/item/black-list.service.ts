import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlackList } from './entity/black-list.entity';
import { Repository } from 'typeorm';
import { FindBlackListResponseDto } from './dto/find-black-list-response.dto';
import { QueryBlackListDto } from './dto/query-black-list.dto';
import { ListBlackListResponseDto } from './dto/list-black-list-response.dto';
import { CreateBlackListDto } from './dto/create-black-list.dto';
import { CreateBlackListResponseDto } from './dto/create-black-list-response.dto';
import { Reason } from '../reason/entity/reason.entity';
import { Client } from '../../client/entity/client.entity';
import { UpdateBlackListDto } from './dto/update-black-list.dto';
import { UpdateBlackListResponseDto } from './dto/update-black-list-response.dto';

@Injectable()
export class BlackListService {
  constructor(
    @InjectRepository(BlackList)
    private readonly blackListRepository: Repository<BlackList>,

    @InjectRepository(Reason)
    private readonly reasonRepository: Repository<Reason>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  public async find(blackListId: number): Promise<FindBlackListResponseDto> {
    const blackListItem = await this.blackListRepository.findOneOrFail({
      select: ['id', 'client', 'reason', 'createdAt', 'updatedAt'],
      where: { id: blackListId },
      relations: {
        client: true,
        reason: true,
      },
    });

    return FindBlackListResponseDto.from(blackListItem);
  }

  public async list({
    clientId,
    reasonId,
    page = 0,
    items = 10,
  }: QueryBlackListDto): Promise<ListBlackListResponseDto> {
    const queryBuilder = this.blackListRepository
      .createQueryBuilder('client_black_list')
      .select('client_black_list.id')
      .addSelect('client_black_list.createdAt')
      .addSelect('client.id')
      .addSelect('client.name')
      .addSelect('reason.id')
      .addSelect('reason.title')
      .leftJoinAndSelect('client_black_list.client', 'client')
      .leftJoinAndSelect('client_black_list.reason', 'reason');

    if (clientId) {
      queryBuilder.andWhere('client.id = :clientId', { clientId });
    }

    if (reasonId) {
      queryBuilder.andWhere('reason.id = :reasonId', { reasonId });
    }

    const [blackList, total] = await queryBuilder
      .skip(page * items)
      .take(items)
      .getManyAndCount();

    return ListBlackListResponseDto.from(blackList, total);
  }

  public async create(
    createBlackListDto: CreateBlackListDto,
  ): Promise<CreateBlackListResponseDto> {
    const [reason, client] = await Promise.all([
      this.reasonRepository.findOneBy({ id: createBlackListDto.reasonId }),
      this.clientRepository.findOneBy({ id: createBlackListDto.clientId }),
    ]);

    const blackListitem = await this.blackListRepository.save({
      ...createBlackListDto,
      reason,
      client,
    });

    return CreateBlackListResponseDto.from(blackListitem);
  }

  public async update(
    blackListItemId: number,
    { reasonId }: UpdateBlackListDto,
  ): Promise<UpdateBlackListResponseDto> {
    const reason = await this.reasonRepository.findOneBy({ id: reasonId });

    await this.blackListRepository.update({ id: blackListItemId }, { reason });

    const blackListItem = await this.blackListRepository.findOne({
      select: ['id', 'client', 'reason', 'createdAt', 'updatedAt'],
      where: { id: blackListItemId },
      relations: {
        client: true,
        reason: true,
      },
    });

    return UpdateBlackListResponseDto.from(blackListItem);
  }

  public async delete(blackListItemId: number): Promise<boolean> {
    const { affected } = await this.blackListRepository.softDelete({
      id: blackListItemId,
    });

    return affected > 0;
  }
}
