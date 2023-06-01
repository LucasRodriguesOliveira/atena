import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../entity/permission.entity';

export class FindPermissionDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'List',
    examples: ['Create', 'List', 'Find', '...'],
  })
  description: string;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  static from({ id, description, createdAt }: Permission): FindPermissionDto {
    return {
      id,
      description,
      createdAt,
    };
  }
}
