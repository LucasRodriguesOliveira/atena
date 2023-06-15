import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInstallmentTypeDto {
  @ApiProperty({
    type: String,
    example: 'Subscription Payment',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
