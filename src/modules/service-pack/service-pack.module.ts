import { Module } from '@nestjs/common';
import { ServicePackItemTypeModule } from './item-type/service-pack-item-type.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePack } from './service/entity/service-pack.entity';
import { Coin } from '../coin/entity/coin.entity';
import { ServicePackController } from './service/service-pack.controller';
import { ServicePackService } from './service/service-pack.service';
import { ServicePackItem } from './item/entity/service-pack-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServicePack, Coin]),
    ServicePackItemTypeModule,
    ServicePackItem,
  ],
  controllers: [ServicePackController],
  providers: [ServicePackService],
})
export class ServicePackModule {}
