import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDecimal,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateCoinDto {
  @ApiProperty({
    type: String,
    example: 'Real',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @MinLength(3)
  name?: string;

  @ApiProperty({
    type: String,
    example: 'BRL',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(3)
  @MinLength(2)
  acronym?: string;

  @ApiProperty({
    type: Number,
    example: 0.2,
    required: false,
  })
  @IsDecimal({ decimal_digits: '1,4' })
  @IsOptional()
  @Min(0)
  value?: number;

  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
