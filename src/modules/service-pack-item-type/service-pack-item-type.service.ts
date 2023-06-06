import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicePackItemType } from './entity/service-pack-item-type.entity';
import { Like, Repository } from 'typeorm';
import { FindServicePackItemTypeResponseDto } from './dto/find-service-pack-item-type-response.dto';
import { QueryServicePackItemTypeDto } from './dto/query-service-pack-item-type.dto';
import { ListServicePackItemTypeResponseDto } from './dto/list-service-pack-item-type-response.dto';
import { CreateServicePackItemTypeDto } from './dto/create-service-pack-item-type.dto';
import { CreateServicePackItemTypeResponseDto } from './dto/create-service-pack-item-type-response.dto';
import { UpdateServicePackItemTypeDto } from './dto/update-service-pack-item-type.dto';
import { UpdateServicePackItemTypeResponseDto } from './dto/update-service-pack-item-type-response.dto';

@Injectable()
export class ServicePackItemTypeService {
  constructor(
    @InjectRepository(ServicePackItemType)
    private readonly servicePackItemTypeRepository: Repository<ServicePackItemType | null>,
  ) {}

  public async find(
    servicePackItemTypeId: number,
  ): Promise<FindServicePackItemTypeResponseDto> {
    const servicePackItemType =
      await this.servicePackItemTypeRepository.findOneBy({
        id: servicePackItemTypeId,
      });

    if (Object.keys(servicePackItemType).length === 0) {
      return null;
    }

    return FindServicePackItemTypeResponseDto.from(servicePackItemType);
  }

  public async list({
    description,
  }: QueryServicePackItemTypeDto): Promise<
    ListServicePackItemTypeResponseDto[]
  > {
    const servicePackItemTypes = await this.servicePackItemTypeRepository.find({
      select: ['id', 'description'],
      where: {
        ...(description ? { description: Like(description) } : {}),
      },
    });

    return ListServicePackItemTypeResponseDto.from(servicePackItemTypes);
  }

  public async create({
    description,
  }: CreateServicePackItemTypeDto): Promise<CreateServicePackItemTypeResponseDto> {
    const servicePackItemType = await this.servicePackItemTypeRepository.save({
      description,
    });

    return CreateServicePackItemTypeResponseDto.from(servicePackItemType);
  }

  public async update(
    servicePackItemTypeId: number,
    { description }: UpdateServicePackItemTypeDto,
  ): Promise<UpdateServicePackItemTypeResponseDto> {
    await this.servicePackItemTypeRepository.update(
      { id: servicePackItemTypeId },
      { description },
    );

    const servicePackItemType =
      await this.servicePackItemTypeRepository.findOneBy({
        id: servicePackItemTypeId,
      });

    return UpdateServicePackItemTypeResponseDto.from(servicePackItemType);
  }

  public async delete(servicePackItemTypeId: number): Promise<boolean> {
    const { affected } = await this.servicePackItemTypeRepository.softDelete({
      id: servicePackItemTypeId,
    });

    return affected > 0;
  }
}
