import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { PaymentMethod } from '../../../payment-method/entity/payment-method.entity';

export class FindPaymentMethodResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Credit Card',
  })
  description: string;

  static from({
    id,
    description,
  }: PaymentMethod): FindPaymentMethodResponseDto {
    return {
      id,
      description,
    };
  }
}
