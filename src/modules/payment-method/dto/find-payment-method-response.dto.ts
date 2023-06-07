import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../entity/payment-method.entity';

export class FindPaymentMethodResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Credit Card',
  })
  description: string;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  static from({
    id,
    description,
    createdAt,
  }: PaymentMethod): FindPaymentMethodResponseDto {
    return {
      id,
      description,
      createdAt,
    };
  }
}
