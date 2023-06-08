import { Module } from '@nestjs/common';
import { ServicePackItemTypeModule } from './item-type/service-pack-item-type.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePack } from './service-pack/entity/service-pack.entity';
import { Coin } from '../coin/entity/coin.entity';
import { ServicePackController } from './service-pack/service-pack.controller';
import { ServicePackService } from './service-pack/service-pack.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServicePack, Coin]),
    ServicePackItemTypeModule,
  ],
  controllers: [ServicePackController],
  providers: [ServicePackService],
})
export class ServicePackModule {}
