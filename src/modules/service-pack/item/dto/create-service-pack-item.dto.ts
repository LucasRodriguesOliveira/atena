import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { randomUUID } from 'crypto';

export class CreateServicePackItemDto {
  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  itemTypeId: number;

  @ApiProperty({
    type: String,
    example: randomUUID(),
    required: true,
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  servicePackId: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @IsInt()
  amount: number;
}
