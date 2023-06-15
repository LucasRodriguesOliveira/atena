import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { randomInt, randomUUID } from 'crypto';

export class CreateInstallmentDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  contractId: string;

  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  installmentTypeId: number;

  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  paymentMethodId: number;

  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  coinId: number;

  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  value: number;

  @ApiProperty({
    type: Date,
    example: new Date(),
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  expiresAt: Date;
}
