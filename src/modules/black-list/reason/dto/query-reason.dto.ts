import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryReasonDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  title?: string;
}
