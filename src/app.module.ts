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
import { CoinModule } from './modules/coin/coin.module';
import { PaymentMethodModule } from './modules/payment-method/payment-method.module';
import { ServicePackModule } from './modules/service-pack/service-pack.module';
import { ContractModule } from './modules/contract/contract.module';
import { ClientModule } from './modules/client/client.module';
import { InstallmentModule } from './modules/installment/item/installment.module';
import { ServiceStageModule } from './modules/service-stage/service-stage.module';
import { CostumerServiceModule } from './modules/costumer-service/costumer-service.module';
import { BlackListModule } from './modules/black-list/black-list.module';
import { SupportTicketModule } from './modules/support-ticket/support-ticket.module';

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
    ServicePackModule,
    PaymentMethodModule,
    ClientModule,
    ContractModule,
    InstallmentModule,
    ServiceStageModule,
    CostumerServiceModule,
    BlackListModule,
    SupportTicketModule,
  ],
})
export class AppModule {}
