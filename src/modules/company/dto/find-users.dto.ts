import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { UserCompany } from '../entity/user-company.entity';

export class FindUsersDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Jhon Doe',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'DEFAULT',
  })
  type: string;

  private static map({ user: { id, name, type } }: UserCompany): FindUsersDto {
    return {
      id,
      name,
      type: type.description,
    };
  }

  static from(users: UserCompany[]): FindUsersDto[] {
    return users.map(FindUsersDto.map);
  }
}
