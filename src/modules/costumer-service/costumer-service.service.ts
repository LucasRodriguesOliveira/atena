import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CostumerService } from './entity/costumer-service.entity';
import { Repository } from 'typeorm';
import { FindCostumerServiceResponseDto } from './dto/find-costumer-service-response.dto';
import { QueryCostumerServiceDto } from './dto/query-costumer-service.dto';
import { ListCostumerServiceResponseDto } from './dto/list-costumer-service-response.dto';
import { CreateCostumerServiceDto } from './dto/create-costumer-service.dto';
import { User } from '../user/entity/user.entity';
import { Client } from '../client/entity/client.entity';
import { ServiceStage } from '../service-stage/entity/service-stage.entity';
import { UpdateCostumerServiceDto } from './dto/update-costumer-service.dto';

@Injectable()
export class CostumerServiceService {
  constructor(
    @InjectRepository(CostumerService)
    private readonly costumerServiceRepository: Repository<CostumerService>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(ServiceStage)
    private readonly serviceStageRepository: Repository<ServiceStage>,
  ) {}

  public async find(
    costumerServiceId: number,
  ): Promise<FindCostumerServiceResponseDto> {
    const costumerService = await this.costumerServiceRepository.findOneOrFail({
      where: { id: costumerServiceId },
      relations: {
        client: true,
        user: true,
        serviceStage: true,
      },
    });

    return FindCostumerServiceResponseDto.from(costumerService);
  }

  public async list({
    userId,
    serviceStageId,
    clientId,
    items = 10,
    page = 0,
  }: QueryCostumerServiceDto): Promise<ListCostumerServiceResponseDto> {
    const queryBuilder = this.costumerServiceRepository
      .createQueryBuilder('costumer_service')
      .select('costumer_service.id')
      .addSelect('costumer_service.createdAt')
      .addSelect('costumer_service.updatedAt')
      .addSelect('client.id')
      .addSelect('client.name')
      .addSelect('user.id')
      .addSelect('user.name')
      .addSelect('service_stage.id')
      .addSelect('service_stage.description')
      .leftJoinAndSelect('costumer_service.client', 'client')
      .leftJoinAndSelect('costumer_service.user', 'user')
      .leftJoinAndSelect('costumer_service.serviceStage', 'service_stage');

    if (userId) {
      queryBuilder.andWhere('user.id = :userId', { userId });
    }

    if (clientId) {
      queryBuilder.andWhere('client.id = :clientId', { clientId });
    }

    if (serviceStageId) {
      queryBuilder.andWhere('service_stage.id = :serviceStageId', {
        serviceStageId,
      });
    }

    queryBuilder.skip(page * items).take(items);

    const [costumerServices, total] = await queryBuilder.getManyAndCount();

    return ListCostumerServiceResponseDto.from(costumerServices, total);
  }

  public async create(
    createCostumerServiceDto: CreateCostumerServiceDto,
  ): Promise<FindCostumerServiceResponseDto> {
    const [client, user, serviceStage] = await Promise.all([
      this.clientRepository.findOneBy({
        id: createCostumerServiceDto.clientId,
      }),
      this.userRepository.findOneBy({
        id: createCostumerServiceDto.userId,
      }),
      this.serviceStageRepository.findOneBy({
        id: createCostumerServiceDto.serviceStageId,
      }),
    ]);

    const costumerService = await this.costumerServiceRepository.save({
      ...createCostumerServiceDto,
      client,
      user,
      serviceStage,
    });

    return FindCostumerServiceResponseDto.from(costumerService);
  }

  public async update(
    costumerServiceId: number,
    { serviceStageId }: UpdateCostumerServiceDto,
  ): Promise<FindCostumerServiceResponseDto> {
    const serviceStage = await this.serviceStageRepository.findOneBy({
      id: serviceStageId,
    });

    await this.costumerServiceRepository.update(
      { id: costumerServiceId },
      { serviceStage },
    );

    const costumerService = await this.costumerServiceRepository.findOne({
      where: { id: costumerServiceId },
      relations: {
        client: true,
        user: true,
        serviceStage: true,
      },
    });

    return FindCostumerServiceResponseDto.from(costumerService);
  }

  public async delete(costumerServiceId: number): Promise<boolean> {
    const { affected } = await this.costumerServiceRepository.softDelete({
      id: costumerServiceId,
    });

    return affected > 0;
  }
}
