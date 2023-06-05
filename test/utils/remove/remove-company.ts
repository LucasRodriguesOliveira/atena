import { Company } from '../../../src/modules/company/entity/company.entity';
import { repository } from '../repository';
import { Repository } from 'typeorm';

interface IRemoveOptions {
  id: string;
}

export async function removeCompany({ id }: IRemoveOptions): Promise<boolean> {
  const companyRepository = repository.get(Company.name) as Repository<Company>;
  const { affected } = await companyRepository.delete({ id });

  return affected > 0;
}
