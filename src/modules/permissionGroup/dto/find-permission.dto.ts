import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../../permission/entity/permission.entity';

export class FindPermissionDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'LIST_ALL',
  })
  description: string;

  static from({ id, description }: Permission): FindPermissionDto {
    return {
      id,
      description,
    };
  }
}
