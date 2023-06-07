import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/env/env.config';
import { AuthModule } from './modules/auth/auth.module';
import { TypeormPostgresModule } from './modules/typeorm/typeorm.module';
import { UserTypeModule } from './modules/user-type/user-type.module';
import { UserModule } from './modules/user/user.module';
import { PermissionModule } from './modules/permission/permission.module';
import { ModuleModule } from './modules/module/module.module';
import { PermissionGroupModule } from './modules/permissionGroup/permission-group.module';
import { CompanyModule } from './modules/company/company.module';
import { ServicePackItemTypeModule } from './modules/service-pack-item-type/service-pack-item-type.module';
import { CoinModule } from './modules/coin/coin.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    TypeormPostgresModule,
    AuthModule,
    UserTypeModule,
    UserModule,
    PermissionModule,
    ModuleModule,
    PermissionGroupModule,
    CompanyModule,
    CoinModule,
    // ServicePackItemTypeModule,
  ],
})
export class AppModule {}
