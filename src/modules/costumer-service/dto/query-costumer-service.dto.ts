import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';
import { randomInt, randomUUID } from 'crypto';

export class QueryCostumerServiceDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({
    type: Number,
    example: 10,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  items?: number;

  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  @IsOptional()
  @IsUUID()
  @Type(() => Number)
  serviceStageId?: number;
}
