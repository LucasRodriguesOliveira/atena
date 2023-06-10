import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { randomUUID } from 'crypto';

export class CreateContractDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  servicePackId: string;

  @ApiProperty({
    type: String,
    example: randomUUID(),
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  companyId: string;

  @ApiProperty({
    type: String,
    example: randomUUID(),
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  coinId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  subscriptionPrice: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  monthlyPayment: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  lateFee: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  monthlyFee: number;

  @ApiProperty({
    type: Date,
    example: new Date(),
    required: true,
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  expiresAt: Date;
}
