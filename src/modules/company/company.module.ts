import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entity/company.entity';
import { UserCompany } from './entity/user-company.entity';
import { UserCompanyService } from './user-company.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company, UserCompany])],
  controllers: [CompanyController],
  providers: [CompanyService, UserCompanyService],
})
export class CompanyModule {}
