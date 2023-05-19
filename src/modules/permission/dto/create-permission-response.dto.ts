import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../entity/permission.entity';

export class CreatePermissionResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  static from({ id, description }: Permission): CreatePermissionResponse {
    return {
      id,
      description,
    };
  }
}
