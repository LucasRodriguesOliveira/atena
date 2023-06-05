import { Permission } from '../../../src/modules/permission/entity/permission.entity';
import { repository } from '../repository';
import { IRemoveOptions } from './iremove-options.interface';
import { Repository } from 'typeorm';

export async function removePermission({
  id,
}: IRemoveOptions): Promise<boolean> {
  const permissionRepository = repository.get(
    Permission.name,
  ) as Repository<Permission>;
  const { affected } = await permissionRepository.delete({ id });

  return affected > 0;
}
