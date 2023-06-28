import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entity/company.entity';
import { UserCompany } from './entity/user-company.entity';
import { UserCompanyService } from './user-company.service';
import { User } from '../user/entity/user.entity';
import { UserCompanyController } from './user-company.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Company, UserCompany, User])],
  controllers: [CompanyController, UserCompanyController],
  providers: [CompanyService, UserCompanyService],
})
export class CompanyModule {}
