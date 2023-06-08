import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class QueryPaymentMethodDto {
  @ApiProperty({
    type: String,
    example: 'Cash',
    required: true,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  description?: string;
}
