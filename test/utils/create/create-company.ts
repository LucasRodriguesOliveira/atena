import { CreateCompanyResponseDto } from '../../../src/modules/company/dto/create-company-response.dto';
import { CreateCompanyDto } from '../../../src/modules/company/dto/create-company.dto';
import { CompanyController } from '../../../src/modules/company/company.controller';

interface CreateCompanyOptions {
  companyController: CompanyController;
}

export async function createCompany({
  companyController,
}: CreateCompanyOptions): Promise<CreateCompanyResponseDto> {
  const createCompanyDto: CreateCompanyDto = {
    name: 'test',
    displayName: 'test',
    email: 'test@test.com',
  };

  return companyController.create(createCompanyDto);
}
