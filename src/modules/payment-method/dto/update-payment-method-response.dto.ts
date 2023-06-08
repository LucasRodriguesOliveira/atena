import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../entity/payment-method.entity';

export class UpdatePaymentMethodResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Real',
  })
  description: string;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  static from({
    id,
    description,
    updatedAt,
  }: PaymentMethod): UpdatePaymentMethodResponseDto {
    return {
      id,
      description,
      updatedAt,
    };
  }
}
