import { UserCompany } from '../../../src/modules/company/entity/user-company.entity';
import { repository } from '../repository';
import { Repository } from 'typeorm';
import { removeAndCheck } from '../remove-and-check';
import { removeUser } from './remove-user';
import { CreateUserCompanyMockResponse } from '../create/create-user-company';
import { removeCompany } from './remove-company';

interface RemoveUserCompanyOptions {
  userCompany: CreateUserCompanyMockResponse;
}

export async function removeUserCompany({
  userCompany,
}: RemoveUserCompanyOptions) {
  const userCompanyRepository = repository.get(
    UserCompany.name,
  ) as Repository<UserCompany>;

  const { affected } = await userCompanyRepository.delete({
    id: userCompany.id,
  });

  await Promise.all([
    removeAndCheck({
      name: `User (${userCompany.username})`,
      removeFunction: async () =>
        removeUser({ username: userCompany.username }),
    }),
    removeAndCheck({
      name: `Company (${userCompany.companyId})`,
      removeFunction: async () => removeCompany({ id: userCompany.companyId }),
    }),
  ]);

  return affected > 0;
}
