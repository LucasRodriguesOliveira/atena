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
import { ServicePackItemType } from '../service-pack/item-type/entity/service-pack-item-type.entity';
import { PaymentMethod } from '../payment-method/entity/payment-method.entity';
import { Coin } from '../coin/entity/coin.entity';
import { ServicePack } from '../service-pack/service/entity/service-pack.entity';
import { ServicePackItem } from '../service-pack/item/entity/service-pack-item.entity';
import { Client } from '../client/entity/client.entity';
import { Contract } from '../contract/entity/contract.entity';
import { InstallmentType } from '../installment/installment-type/entity/installment-type.entity';

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
        PaymentMethod,
        Coin,
        ServicePack,
        ServicePackItem,
        Client,
        Contract,
        InstallmentType,
      ]),
    ),
  ],
})
export class TypeormPostgresModule {}
