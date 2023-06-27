import { SetMetadata } from '@nestjs/common';

export const UserRole = (...types: string[]) => SetMetadata('type', types);
