import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicePack } from './entity/service-pack.entity';
import { Like, Repository } from 'typeorm';
import { FindServicePackResponseDto } from './dto/find-service-pack-response.dto';
import { QueryListServicePackDto } from './dto/query-list-service-pack.dto';
import { ListServicePackResponseDto } from './dto/list-service-pack-response.dto';
import { CreateServicePackResponseDto } from './dto/create-service-pack-response.dto';
import { CreateServicePackDto } from './dto/create-service-pack.dto';
import { UpdateServicePackDto } from './dto/update-service-pack.dto';
import { UpdateServicePackResponseDto } from './dto/update-service-pack-response.dto';
import { Coin } from '../../coin/entity/coin.entity';

@Injectable()
export class ServicePackService {
  constructor(
    @InjectRepository(ServicePack)
    private readonly servicePackRepository: Repository<ServicePack>,

    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
  ) {}

  public async find(
    servicePackId: string,
  ): Promise<FindServicePackResponseDto> {
    const servicePack = await this.servicePackRepository.findOneOrFail({
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        subscriptionPrice: true,
        monthlyPayment: true,
        lateFee: true,
        monthlyFee: true,
        status: true,
        coin: {
          id: true,
          acronym: true,
        },
        createdAt: true,
      },
      where: { id: servicePackId },
      relations: {
        coin: true,
      },
    });

    return FindServicePackResponseDto.from(servicePack);
  }

  public async list({
    name,
  }: QueryListServicePackDto): Promise<ListServicePackResponseDto[]> {
    const servicePacks = await this.servicePackRepository.find({
      select: {
        id: true,
        name: true,
        description: true,
        monthlyPayment: true,
        coin: {
          id: true,
          acronym: true,
        },
      },
      where: {
        ...(name ? { name: Like(name) } : {}),
      },
      relations: {
        coin: true,
      },
    });

    return ListServicePackResponseDto.from(servicePacks);
  }

  public async create(
    createServicePackDto: CreateServicePackDto,
  ): Promise<CreateServicePackResponseDto> {
    const coin = await this.coinRepository.findOneBy({
      id: createServicePackDto.coinId,
    });

    const servicePack = await this.servicePackRepository.save(
      this.servicePackRepository.create({
        ...createServicePackDto,
        coin,
      }),
    );

    return CreateServicePackResponseDto.from(servicePack);
  }

  public async update(
    servicePackId: string,
    updateServicePackDto: UpdateServicePackDto,
  ): Promise<UpdateServicePackResponseDto> {
    const coin = await this.coinRepository.findOneBy({
      id: updateServicePackDto?.coinId,
    });

    await this.servicePackRepository.update(
      { id: servicePackId },
      {
        ...updateServicePackDto,
        ...(Object.keys(coin).length > 0 ? { coin } : {}),
      },
    );

    const servicePack = await this.servicePackRepository.findOne({
      where: {
        id: servicePackId,
      },
      relations: {
        coin: true,
      },
    });

    return UpdateServicePackResponseDto.from(servicePack);
  }

  public async delete(servicePackId: string): Promise<boolean> {
    const { affected } = await this.servicePackRepository.softDelete({
      id: servicePackId,
    });

    return affected > 0;
  }
}
