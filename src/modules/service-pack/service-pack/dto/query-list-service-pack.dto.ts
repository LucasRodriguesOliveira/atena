import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class QueryListServicePackDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Basic',
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  name?: string;
}
