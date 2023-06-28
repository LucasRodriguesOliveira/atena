import { SetMetadata } from '@nestjs/common';

export const AppModule = (moduleName: string) =>
  SetMetadata('module', moduleName);
