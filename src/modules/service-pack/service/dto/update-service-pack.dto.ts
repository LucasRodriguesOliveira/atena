import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateServicePackDto {
  @ApiProperty({
    type: String,
    example: 'Pro',
    required: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;

  @ApiProperty({
    type: String,
    example: 'Professional services.',
    required: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  description?: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  duration?: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  subscriptionPrice?: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  monthlyPayment?: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  lateFee?: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  monthlyFee?: number;

  @ApiProperty({
    type: Boolean,
    example: true,
    required: true,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  coinId?: number;
}
