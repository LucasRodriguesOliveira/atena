import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity } from './entity/module.entity';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModuleEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [ModuleService],
  controllers: [ModuleController],
})
export class ModuleModule {}
