import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../entity/user-type.entity';

export class UpdateUserTypeResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  static from({ id, description }: UserType): UpdateUserTypeResponse {
    return {
      id,
      description,
    };
  }
}
