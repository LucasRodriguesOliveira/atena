import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleConfig } from '../../config/typeorm/typeorm-module.config';
import { Permission } from '../permission/entity/permission.entity';
import { UserType } from '../user-type/entity/user-type.entity';
import { User } from '../user/entity/user.entity';
import { Module as ModuleEntity } from '../module/entity/module.entity';
import { PermissionGroup } from '../permissionGroup/entity/permission-group.entity';
import { Company } from '../company/entity/company.entity';
import { UserCompany } from '../company/entity/user-company.entity';
import { ServicePackItemType } from '../service-pack-item-type/entity/service-pack-item-type.entity';

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
        UserCompany,
        ServicePackItemType,
      ]),
    ),
  ],
})
export class TypeormPostgresModule {}
