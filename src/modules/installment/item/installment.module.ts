import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installment } from './entity/installment.entity';
import { InstallmentService } from './installment.service';
import { InstallmentController } from './installment.controller';
import { InstallmentTypeModule } from '../type/installment-type.module';
import { Contract } from '../../contract/entity/contract.entity';
import { InstallmentType } from '../type/entity/installment-type.entity';
import { PaymentMethod } from '../../payment-method/entity/payment-method.entity';
import { Coin } from '../../coin/entity/coin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Installment,
      Contract,
      InstallmentType,
      PaymentMethod,
      Coin,
    ]),
    InstallmentTypeModule,
  ],
  providers: [InstallmentService],
  controllers: [InstallmentController],
})
export class InstallmentModule {}
