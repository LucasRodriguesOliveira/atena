import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePaymentMethodDto {
  @ApiProperty({
    type: String,
    example: 'Real',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  description: string;
}
