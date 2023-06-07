import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class QueryServicePackItemTypeDto {
  @ApiProperty({
    type: String,
    example: 'TOP_PAGE',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  description?: string;
}
