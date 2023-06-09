import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class QueryClientDto {
  @ApiProperty({
    type: String,
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;
}
