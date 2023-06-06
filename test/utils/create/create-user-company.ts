import { CompanyController } from '../../../src/modules/company/company.controller';
import { AuthController } from '../../../src/modules/auth/auth.controller';
import { createUser } from './create-user';
import { UserTypeEnum } from '../../../src/modules/user-type/type/user-type.enum';
import { repository } from '../repository';
import { User } from '../../../src/modules/user/entity/user.entity';
import { Repository } from 'typeorm';
import { createCompany } from './create-company';
import { CreateUserCompanyDto } from '../../../src/modules/company/dto/create-user-company.dto';

interface CreateUserCompanyOptions {
  companyController: CompanyController;
  authController: AuthController;
  testName?: string;
}

export class CreateUserCompanyMockResponse {
  id: number;
  username: string;
  companyId: string;
}

export async function createUserCompany({
  companyController,
  authController,
  testName,
}: CreateUserCompanyOptions): Promise<CreateUserCompanyMockResponse> {
  const [username, company] = await Promise.all([
    createUser({
      authController,
      userType: UserTypeEnum.ADMIN,
      override: true,
      testName: `CreateCompany - ${testName}`,
    }),
    createCompany({ companyController }),
  ]);

  const userRepository = repository.get(User.name) as Repository<User>;
  const user = await userRepository.findOneBy({ username });

  const createUserCompanyDto: CreateUserCompanyDto = {
    userId: user.id,
  };

  const result = await companyController.attachUser(
    company.id,
    createUserCompanyDto,
  );

  return {
    id: result.id,
    username,
    companyId: company.id,
  };
}
