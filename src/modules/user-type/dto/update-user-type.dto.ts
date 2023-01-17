import { IsString, MaxLength } from 'class-validator';

export class UpdateUserTypeDto {
  @IsString()
  @MaxLength(50)
  description: string;
}
