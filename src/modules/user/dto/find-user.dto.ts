import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class FindUserDto {
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

  static from({ id, name, username, type }: User): FindUserDto {
    return {
      id,
      name,
      username,
      type: type.description,
    };
  }
}
