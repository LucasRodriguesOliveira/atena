import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../entity/permission.entity';

export class UpdatePermissionResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static from({
    id,
    description,
    createdAt,
    updatedAt,
  }: Permission): UpdatePermissionResponse {
    return {
      id,
      description,
      createdAt,
      updatedAt,
    };
  }
}
