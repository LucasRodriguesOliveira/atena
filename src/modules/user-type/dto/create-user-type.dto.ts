import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserTypeDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  @MinLength(3)
  description: string;
}
