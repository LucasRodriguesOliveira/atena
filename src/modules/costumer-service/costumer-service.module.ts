import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostumerService } from './entity/costumer-service.entity';
import { Client } from '../client/entity/client.entity';
import { User } from '../user/entity/user.entity';
import { ServiceStage } from '../service-stage/entity/service-stage.entity';
import { CostumerServiceService } from './costumer-service.service';
import { CostumerServiceController } from './costumer-service.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CostumerService, Client, User, ServiceStage]),
  ],
  providers: [CostumerServiceService],
  controllers: [CostumerServiceController],
})
export class CostumerServiceModule {}
