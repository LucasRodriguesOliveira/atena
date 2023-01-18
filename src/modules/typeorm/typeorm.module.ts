import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleConfig } from '../../config/typeorm/typeorm-module.config';
import { UserType } from '../user-type/entity/user-type.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmModuleConfig([UserType, User]))],
})
export class TypeormPostgresModule {}
