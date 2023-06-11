import { randomBytes } from 'crypto';
import { CreateInstallmentTypeResponseDto } from '../../../src/modules/installment/installment-type/dto/create-installment-type-response.dto';
import { CreateInstallmentTypeDto } from '../../../src/modules/installment/installment-type/dto/create-installment-type.dto';
import { InstallmentTypeController } from '../../../src/modules/installment/installment-type/installment-type.controller';

interface InstallmentTypeOptions {
  installmentTypeController: InstallmentTypeController;
}

export async function createInstallmentType({
  installmentTypeController,
}: InstallmentTypeOptions): Promise<CreateInstallmentTypeResponseDto> {
  const createInstallmentTypeDto: CreateInstallmentTypeDto = {
    description: randomBytes(10).toString('hex'),
  };

  return installmentTypeController.create(createInstallmentTypeDto);
}
