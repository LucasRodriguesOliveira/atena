import { CompanyController } from '../../../src/modules/company/company.controller';
import { AuthController } from '../../../src/modules/auth/auth.controller';
import { createUser } from './create-user';
import { UserTypeEnum } from '../../../src/modules/user-type/type/user-type.enum';
import { User } from '../../../src/modules/user/entity/user.entity';
import { createCompany } from './create-company';
import { CreateUserCompanyDto } from '../../../src/modules/company/dto/create-user-company.dto';
import { RepositoryManager } from '../repository';
import { UserCompanyController } from '../../../src/modules/company/user-company.controller';

interface CreateUserCompanyOptions {
  userCompanyController: UserCompanyController;
  companyController: CompanyController;
  authController: AuthController;
  repositoryManager: RepositoryManager;
  testName?: string;
}

export class CreateUserCompanyMockResponse {
  id: number;
  username: string;
  companyId: string;
}

export async function createUserCompany({
  userCompanyController,
  companyController,
  authController,
  repositoryManager,
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

  const { id: userId } = await repositoryManager.find<User>(User.name, {
    username,
  });

  const createUserCompanyDto: CreateUserCompanyDto = {
    userId,
  };

  const result = await userCompanyController.attachUser(
    company.id,
    createUserCompanyDto,
  );

  return {
    id: result.id,
    username,
    companyId: company.id,
  };
}
