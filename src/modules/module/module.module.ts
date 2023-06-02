import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity } from './entity/module.entity';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity])],
  providers: [ModuleService],
  controllers: [ModuleController],
})
export class ModuleModule {}
