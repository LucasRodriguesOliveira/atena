import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleConfig } from '../../config/typeorm/typeorm-module.config';
import { Permission } from '../permission/entity/permission.entity';
import { UserType } from '../user-type/entity/user-type.entity';
import { User } from '../user/entity/user.entity';
import { Module as ModuleEntity } from '../module/entity/module.entity';
import { PermissionGroup } from '../permissionGroup/entity/permission-group.entity';
import { Company } from '../company/entity/company.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(
      typeOrmModuleConfig([
        UserType,
        User,
        Permission,
        ModuleEntity,
        PermissionGroup,
        Company,
      ]),
    ),
  ],
})
export class TypeormPostgresModule {}
