import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleConfig } from '../../config/typeorm/typeorm-module.config';
import { UserType } from '../user-type/user-type.module';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmModuleConfig([UserType]))],
})
export class TypeormPostgresModule {}
