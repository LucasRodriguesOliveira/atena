import { CreatePermissionResponse } from '../../../src/modules/permission/dto/create-permission-response.dto';
import { CreatePermissionDto } from '../../../src/modules/permission/dto/create-permission.dto';
import { PermissionController } from '../../../src/modules/permission/permission.controller';

interface CreatePermissionOptions {
  permissionController: PermissionController;
}

export async function createPermission({
  permissionController,
}: CreatePermissionOptions): Promise<CreatePermissionResponse> {
  const createPermissionDto: CreatePermissionDto = {
    description: 'TEST_PERMISSION',
  };

  return permissionController.create(createPermissionDto);
}
