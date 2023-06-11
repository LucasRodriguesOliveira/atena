import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QueryInstallmentTypeDto {
  @ApiProperty({
    type: String,
    example: 'Monthly payment',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  description?: string;
}
