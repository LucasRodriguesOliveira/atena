import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstallmentType } from './entity/installment-type.entity';
import { InstallmentTypeService } from './installment-type.service';
import { InstallmentTypeController } from './installment-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InstallmentType])],
  providers: [InstallmentTypeService],
  controllers: [InstallmentTypeController],
})
export class InstallmentTypeModule {}
