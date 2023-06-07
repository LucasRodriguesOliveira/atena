import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicePack } from './entity/service-pack.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServicePackService {
  constructor(
    @InjectRepository(ServicePack)
    private readonly servicePackRepository: Repository<ServicePack>,
  ) {}

  public async find(servicePackId: string): Promise<FindServicePackResponseDto> {}
}
