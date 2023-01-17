import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserTypeDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  @MinLength(3)
  description: string;
}
