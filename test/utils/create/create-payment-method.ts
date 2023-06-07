import { CreatePaymentMethodResponseDto } from '../../../src/modules/payment-method/dto/create-payment-method-response.dto';
import { CreatePaymentMethodDto } from '../../../src/modules/payment-method/dto/create-payment-method.dto';
import { PaymentMethodController } from '../../../src/modules/payment-method/payment-method.controller';

interface CreatePaymentMethodOptions {
  paymentMethodController: PaymentMethodController;
}

export async function createPaymentMethod({
  paymentMethodController,
}: CreatePaymentMethodOptions): Promise<CreatePaymentMethodResponseDto> {
  const createPaymentMethodDto: CreatePaymentMethodDto = {
    description: 'TEST_PAYMENT_METHOD',
  };

  return paymentMethodController.create(createPaymentMethodDto);
}
