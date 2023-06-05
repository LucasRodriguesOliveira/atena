import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../../user-type/entity/user-type.entity';

export class ListUserTypeDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'DEFAULT',
  })
  description: string;

  static from({ id, description }: UserType): ListUserTypeDto {
    return {
      id,
      description,
    };
  }
}
