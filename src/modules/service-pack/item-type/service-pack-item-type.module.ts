import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePackItemType } from './entity/service-pack-item-type.entity';
import { ServicePackItemTypeService } from './service-pack-item-type.service';
import { ServicePackItemTypeController } from './service-pack-item-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServicePackItemType])],
  providers: [ServicePackItemTypeService],
  controllers: [ServicePackItemTypeController],
})
export class ServicePackItemTypeModule {}
