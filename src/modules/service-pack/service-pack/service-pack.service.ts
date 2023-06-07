import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicePack } from './entity/service-pack.entity';
import { Repository } from 'typeorm';
import { FindServicePackResponseDto } from './dto/find-service-pack-response.dto';

@Injectable()
export class ServicePackService {
  constructor(
    @InjectRepository(ServicePack)
    private readonly servicePackRepository: Repository<ServicePack>,
  ) {}

  public async find(
    servicePackId: string,
  ): Promise<FindServicePackResponseDto | null> {
    const servicePack = await this.servicePackRepository.findOneBy({
      id: servicePackId,
    });

    if (Object.keys(servicePack).length === 0) {
      return null;
    }

    return FindServicePackResponseDto.from(servicePack);
  }
}
