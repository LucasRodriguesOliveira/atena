import { IsString, MaxLength } from 'class-validator';

export class CreateUserTypeDto {
  @IsString()
  @MaxLength(50)
  description: string;
}
