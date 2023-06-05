import { Repository } from 'typeorm';
import { UserType } from '../../../src/modules/user-type/entity/user-type.entity';
import { repository } from '../repository';
import { IRemoveOptions } from './iremove-options.interface';

export async function removeUserType({ id }: IRemoveOptions): Promise<boolean> {
  const userTypeRepository = repository.get(
    UserType.name,
  ) as Repository<UserType>;
  const { affected } = await userTypeRepository.delete({ id });

  return affected > 0;
}
