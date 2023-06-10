import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './entity/contract.entity';
import { ServicePack } from '../service-pack/service/entity/service-pack.entity';
import { Company } from '../company/entity/company.entity';
import { Client } from '../client/entity/client.entity';
import { Coin } from '../coin/entity/coin.entity';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract, ServicePack, Company, Client, Coin]),
  ],
  providers: [ContractService],
  controllers: [ContractController],
})
export class ContractModule {}
