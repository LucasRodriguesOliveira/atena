import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTokenDurationTypeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  description: string;
}
