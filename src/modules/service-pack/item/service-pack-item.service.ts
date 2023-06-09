import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicePackItem } from './entity/service-pack-item.entity';
import { Repository } from 'typeorm';
import { FindServicePackItemResponseDto } from './dto/find-service-pack-item-response.dto';
import { CreateServicePackItemDto } from './dto/create-service-pack-item.dto';
import { CreateServicePackItemResponseDto } from './dto/create-service-pack-item-response.dto';
import { ServicePack } from '../service/entity/service-pack.entity';
import { ServicePackItemType } from '../item-type/entity/service-pack-item-type.entity';
import { UpdateServicePackItemDto } from './dto/update-service-pack-item.dto';
import { UpdateServicePackItemResponseDto } from './dto/update-service-pack-item-response.dto';

@Injectable()
export class ServicePackItemService {
  constructor(
    @InjectRepository(ServicePackItem)
    private readonly servicePackItemRepository: Repository<ServicePackItem>,

    @InjectRepository(ServicePack)
    private readonly servicePackRepository: Repository<ServicePack>,

    @InjectRepository(ServicePackItemType)
    private readonly servicePackItemTypeRepository: Repository<ServicePackItemType>,
  ) {}

  public async find(
    servicePackItemId: number,
  ): Promise<FindServicePackItemResponseDto | null> {
    const servicePackItem = await this.servicePackItemRepository.findOne({
      select: [
        'id',
        'servicePack',
        'itemType',
        'amount',
        'status',
        'createdAt',
      ],
      where: { id: servicePackItemId },
      relations: {
        servicePack: true,
        itemType: true,
      },
    });

    if (Object.keys(servicePackItem).length === 0) {
      return null;
    }

    return FindServicePackItemResponseDto.from(servicePackItem);
  }

  public async create(
    createServicePackItemDto: CreateServicePackItemDto,
  ): Promise<CreateServicePackItemResponseDto> {
    const [servicePack, itemType] = await Promise.all([
      this.servicePackRepository.findOneBy({
        id: createServicePackItemDto.servicePackId,
      }),
      this.servicePackItemTypeRepository.findOneBy({
        id: createServicePackItemDto.itemTypeId,
      }),
    ]);

    const item = await this.servicePackItemRepository.save({
      ...createServicePackItemDto,
      servicePack,
      itemType,
    });

    return CreateServicePackItemResponseDto.from(item);
  }

  public async update(
    servicePackItemId: number,
    { amount }: UpdateServicePackItemDto,
  ): Promise<UpdateServicePackItemResponseDto> {
    await this.servicePackItemRepository.update(
      { id: servicePackItemId },
      { amount },
    );

    const item = await this.servicePackItemRepository.findOne({
      select: ['id', 'amount', 'updatedAt', 'itemType', 'servicePack'],
      where: { id: servicePackItemId },
      relations: {
        itemType: true,
        servicePack: true,
      },
    });

    return UpdateServicePackItemResponseDto.from(item);
  }

  public async delete(servicePackItemId: number): Promise<boolean> {
    const { affected } = await this.servicePackItemRepository.delete({
      id: servicePackItemId,
    });

    return affected > 0;
  }
}
