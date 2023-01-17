import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleConfig } from '../../config/typeorm/typeorm-module.config';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmModuleConfig([]))],
})
export class TypeormPostgresModule {}
