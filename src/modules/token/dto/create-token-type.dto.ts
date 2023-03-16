import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTokenTypeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty()
  description: string;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  durationTypeId: number;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty()
  durationAmount: number;
}
