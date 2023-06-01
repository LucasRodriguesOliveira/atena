import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../entity/permission.entity';

export class ListPermissionDto {
  @ApiProperty({
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    examples: ['Create', 'List', 'Find', '...'],
    example: 'List',
    type: String,
  })
  description: string;

  static from({ id, description }: Permission): ListPermissionDto {
    return {
      id,
      description,
    };
  }
}
