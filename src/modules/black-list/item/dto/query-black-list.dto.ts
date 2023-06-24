import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { randomInt, randomUUID } from 'crypto';

export class QueryBlackListDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  clientId?: string;

  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  reasonId?: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    type: Number,
    required: false,
    default: 10,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  items?: number;
}
