import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePack } from '../service/entity/service-pack.entity';
import { ServicePackItem } from './entity/service-pack-item.entity';
import { ServicePackItemType } from '../item-type/entity/service-pack-item-type.entity';
import { ServicePackItemController } from './service-pack-item.controller';
import { ServicePackItemService } from './service-pack-item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServicePack,
      ServicePackItem,
      ServicePackItemType,
    ]),
  ],
  controllers: [ServicePackItemController],
  providers: [ServicePackItemService],
})
export class ServicePackItemModule {}
