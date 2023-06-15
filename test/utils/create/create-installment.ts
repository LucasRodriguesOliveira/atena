import { randomInt } from 'crypto';
import { ClientController } from '../../../src/modules/client/client.controller';
import { CoinController } from '../../../src/modules/coin/coin.controller';
import { CompanyController } from '../../../src/modules/company/company.controller';
import { ContractController } from '../../../src/modules/contract/contract.controller';
import { CreateInstallmentResponseDto } from '../../../src/modules/installment/item/dto/create-installment-response.dto';
import { CreateInstallmentDto } from '../../../src/modules/installment/item/dto/create-installment.dto';
import { InstallmentController } from '../../../src/modules/installment/item/installment.controller';
import { InstallmentTypeController } from '../../../src/modules/installment/type/installment-type.controller';
import { PaymentMethodController } from '../../../src/modules/payment-method/payment-method.controller';
import { ServicePackController } from '../../../src/modules/service-pack/service/service-pack.controller';
import { createCoin } from './create-coin';
import { createContract } from './create-contract';
import { createInstallmentType } from './create-installment-type';
import { createPaymentMethod } from './create-payment-method';
import { CreateContractResponseDto } from '../../../src/modules/contract/dto/create-contract-response.dto';

interface InstallmentOptions {
  installmentController: InstallmentController;
  coinController: CoinController;
  contractController: ContractController;
  clientController: ClientController;
  companyController: CompanyController;
  servicePackController: ServicePackController;
  installmentTypeController: InstallmentTypeController;
  paymentMethodController: PaymentMethodController;
}

export interface CreateInstallmentResponse {
  installment: CreateInstallmentResponseDto;
  contract: CreateContractResponseDto;
}

export async function createInstallment({
  installmentController,
  coinController,
  contractController,
  clientController,
  companyController,
  servicePackController,
  installmentTypeController,
  paymentMethodController,
}: InstallmentOptions): Promise<CreateInstallmentResponse> {
  const [coin, contract, installmentType, paymentMethod] = await Promise.all([
    createCoin({ coinController }),
    createContract({
      contractController,
      companyController,
      clientController,
      servicePackController,
      coinController,
    }),
    createInstallmentType({ installmentTypeController }),
    createPaymentMethod({ paymentMethodController }),
  ]);

  const createInstallmentDto: CreateInstallmentDto = {
    coinId: coin.id,
    contractId: contract.id,
    installmentTypeId: installmentType.id,
    paymentMethodId: paymentMethod.id,
    expiresAt: new Date(),
    value: randomInt(10, 100),
  };

  return {
    installment: await installmentController.create(createInstallmentDto),
    contract,
  };
}
