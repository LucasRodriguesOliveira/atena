import { SetMetadata } from '@nestjs/common';

export const UserRole = (type: string) => SetMetadata('type', type);
