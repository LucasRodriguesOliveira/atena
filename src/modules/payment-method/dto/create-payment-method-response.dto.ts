import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../entity/payment-method.entity';

export class CreatePaymentMethodResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Cash',
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
  }: PaymentMethod): CreatePaymentMethodResponseDto {
    return {
      id,
      description,
      createdAt,
    };
  }
}
