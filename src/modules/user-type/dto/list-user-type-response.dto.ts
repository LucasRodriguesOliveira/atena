import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../entity/user-type.entity';

export class ListUserTypeResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  static from({ id, description }: UserType): ListUserTypeResponse {
    return {
      id,
      description,
    };
  }
}
