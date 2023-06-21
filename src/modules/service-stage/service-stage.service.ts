import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceStage } from './entity/service-stage.entity';
import { Repository } from 'typeorm';
import { FindServiceStageResponseDto } from './dto/find-service-stage-response.dto';
import { QueryServiceStageDto } from './dto/query-service-stage.dto';
import { ListServiceStageResponseDto } from './dto/list-service-stage-response.dto';
import { CreateServiceStageDto } from './dto/create-service-stage.dto';
import { CreateServiceStageResponseDto } from './dto/create-service-stage-response.dto';
import { UpdateServiceStageResponseDto } from './dto/update-service-stage-response.dto';
import { UpdateServiceStageDto } from './dto/update-service-stage.dto';

@Injectable()
export class ServiceStageService {
  constructor(
    @InjectRepository(ServiceStage)
    private readonly serviceStageRepository: Repository<ServiceStage>,
  ) {}

  public async find(
    serviceStageId: number,
  ): Promise<FindServiceStageResponseDto> {
    const serviceStage = await this.serviceStageRepository.findOneByOrFail({
      id: serviceStageId,
    });

    return FindServiceStageResponseDto.from(serviceStage);
  }

  public async list({
    description,
  }: QueryServiceStageDto): Promise<ListServiceStageResponseDto[]> {
    const serviceStages = await this.serviceStageRepository.find({
      where: { ...(description ? { description } : {}) },
    });

    return ListServiceStageResponseDto.from(serviceStages);
  }

  public async create({
    description,
  }: CreateServiceStageDto): Promise<CreateServiceStageResponseDto> {
    const serviceStage = await this.serviceStageRepository.save({
      description,
    });

    return CreateServiceStageResponseDto.from(serviceStage);
  }

  public async update(
    serviceStageId: number,
    updateServiceStageDto: UpdateServiceStageDto,
  ): Promise<UpdateServiceStageResponseDto> {
    await this.serviceStageRepository.update(
      { id: serviceStageId },
      { ...updateServiceStageDto },
    );

    const serviceStage = await this.serviceStageRepository.findOneBy({
      id: serviceStageId,
    });

    return UpdateServiceStageResponseDto.from(serviceStage);
  }

  public async delete(serviceStageId: number): Promise<boolean> {
    const { affected } = await this.serviceStageRepository.softDelete({
      id: serviceStageId,
    });

    return affected > 0;
  }
}
