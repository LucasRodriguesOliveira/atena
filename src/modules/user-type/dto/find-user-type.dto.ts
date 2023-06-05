import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../entity/user-type.entity';

export class FindUserTypeDto {
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

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  static from({
    id,
    description,
    createdAt,
    updatedAt,
  }: UserType): FindUserTypeDto {
    return {
      id,
      description,
      createdAt,
      updatedAt,
    };
  }
}
