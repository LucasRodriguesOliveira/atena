import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';

export class QuerySupportTicketDto {
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
    type: String,
    example: randomUUID(),
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    type: String,
    example: 'Cannot acess user profile',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    type: Number,
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  items?: number;
}
