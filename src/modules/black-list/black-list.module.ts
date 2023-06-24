import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlackList } from './item/entity/black-list.entity';
import { Reason } from './reason/entity/reason.entity';
import { Client } from '../client/entity/client.entity';
import { BlackListService } from './item/black-list.service';
import { ReasonService } from './reason/reason.service';
import { BlackListController } from './item/black-list.controller';
import { ReasonController } from './reason/reason.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BlackList, Reason, Client])],
  providers: [BlackListService, ReasonService],
  controllers: [BlackListController, ReasonController],
})
export class BlackListModule {}
