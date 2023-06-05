import { removePermission } from './remove-permission';
import { removeModule } from './remove-module';
import { removeUserType } from './remove-user-type';
import { FindPermissionGroupDto } from '../../../src/modules/permissionGroup/dto/find-permission-group.dto';
import { removeAndCheck } from '../remove-and-check';
import { DeepPartial, Repository } from 'typeorm';
import { PermissionGroup } from '../../../src/modules/permissionGroup/entity/permission-group.entity';
import { repository } from '../repository';

interface RemovePermissionGroupOptions {
  permissionGroup: DeepPartial<FindPermissionGroupDto>;
}

export async function removePermissionGroup({
  permissionGroup: { id, module, permission, userType },
}: RemovePermissionGroupOptions): Promise<boolean> {
  const permissionGroupRepository = repository.get(
    PermissionGroup.name,
  ) as Repository<PermissionGroup>;
  const { affected } = await permissionGroupRepository.delete({ id });

  await Promise.all([
    removeAndCheck({
      name: `Permission [${permission.id}]`,
      removeFunction: async () => removePermission({ id: permission.id }),
    }),
    removeAndCheck({
      name: `Module [${module.id}]`,
      removeFunction: async () => removeModule({ id: module.id }),
    }),
    removeAndCheck({
      name: `User Type [${userType.id}]`,
      removeFunction: async () => removeUserType({ id: userType.id }),
    }),
  ]);

  return affected > 0;
}
