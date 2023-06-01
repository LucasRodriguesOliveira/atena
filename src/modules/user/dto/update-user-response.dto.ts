import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class UpdateUserResponseDto {
  @ApiProperty({
    example: '3719923c-5d59-44fd-bbdd-6e35ac6f1937',
    type: String,
  })
  id: string;

  @ApiProperty({
    example: 'j.doe',
    type: String,
  })
  username: string;

  @ApiProperty({
    example: 'John Doe',
    type: String,
  })
  name: string;

  @ApiProperty({
    example: 'DEFAULT',
    type: String,
  })
  type: string;

  @ApiProperty({
    example: new Date(),
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    example: new Date(),
    type: Date,
  })
  updatedAt: Date;

  static from({
    id,
    name,
    username,
    type,
    createdAt,
    updatedAt,
  }: User): UpdateUserResponseDto {
    return {
      id,
      name,
      username,
      type: type.description,
      createdAt,
      updatedAt,
    };
  }
}
