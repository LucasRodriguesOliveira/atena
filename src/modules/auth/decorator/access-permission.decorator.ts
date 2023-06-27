import { SetMetadata } from '@nestjs/common';

export const AccessPermission = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);
