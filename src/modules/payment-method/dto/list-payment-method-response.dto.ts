import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../entity/payment-method.entity';

export class ListPaymentMethodResponseDto {
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

  static map({ id, description }: PaymentMethod): ListPaymentMethodResponseDto {
    return {
      id,
      description,
    };
  }

  static from(paymentMethods: PaymentMethod[]): ListPaymentMethodResponseDto[] {
    return paymentMethods.map((paymentMethod) =>
      ListPaymentMethodResponseDto.map(paymentMethod),
    );
  }
}
