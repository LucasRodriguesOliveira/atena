import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  @MinLength(5)
  password: string;

  @IsNotEmpty()
  @IsInt()
  userTypeId: number;
}
