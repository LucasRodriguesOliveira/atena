import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceStage } from './entity/service-stage.entity';
import { ServiceStageService } from './service-stage.service';
import { ServiceStageController } from './service-stage.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceStage])],
  providers: [ServiceStageService],
  controllers: [ServiceStageController],
})
export class ServiceStageModule {}
