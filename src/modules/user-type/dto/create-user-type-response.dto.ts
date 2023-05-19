import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../entity/user-type.entity';

export class CreateUserTypeResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  static from({
    id,
    description,
    createdAt,
  }: UserType): CreateUserTypeResponse {
    return {
      id,
      description,
      createdAt,
    };
  }
}
