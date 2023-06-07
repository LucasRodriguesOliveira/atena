import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePaymentMethodDto {
  @ApiProperty({
    type: String,
    example: 'Cash',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  description: string;
}
