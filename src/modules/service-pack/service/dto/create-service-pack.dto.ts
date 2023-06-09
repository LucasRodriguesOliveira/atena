import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateServicePackDto {
  @ApiProperty({
    type: String,
    example: 'Pro',
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    type: String,
    example: 'Professional services',
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  description: string;

  @ApiProperty({
    type: Number,
    example: 12,
    required: true,
    description: 'in months',
  })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({
    type: Number,
    example: 299.99,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  subscriptionPrice: number;

  @ApiProperty({
    type: Number,
    example: 149.99,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  monthlyPayment: number;

  @ApiProperty({
    type: Number,
    example: 0.17,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  lateFee: number;

  @ApiProperty({
    type: Number,
    example: 0.039,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  monthlyFee: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  coinId: number;
}
