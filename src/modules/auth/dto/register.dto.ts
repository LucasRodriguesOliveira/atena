import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  @ApiProperty({ example: 'j.doe' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  @MinLength(5)
  @ApiProperty({ example: 'mypass123' })
  password: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 4 })
  userTypeId: number;
}
