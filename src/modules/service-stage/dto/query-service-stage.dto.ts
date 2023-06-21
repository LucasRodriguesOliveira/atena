import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryServiceStageDto {
  @ApiProperty({
    type: String,
    example: 'Waiting',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
