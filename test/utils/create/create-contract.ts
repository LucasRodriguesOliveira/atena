import { randomInt } from 'crypto';
import { ClientController } from '../../../src/modules/client/client.controller';
import { CoinController } from '../../../src/modules/coin/coin.controller';
import { CompanyController } from '../../../src/modules/company/company.controller';
import { ContractController } from '../../../src/modules/contract/contract.controller';
import { CreateContractResponseDto } from '../../../src/modules/contract/dto/create-contract-response.dto';
import { CreateContractDto } from '../../../src/modules/contract/dto/create-contract.dto';
import { ServicePackController } from '../../../src/modules/service-pack/service/service-pack.controller';
import { createClient } from './create-client';
import { createCompany } from './create-company';
import { createServicePack } from './create-service-pack';

interface CreateContractOptions {
  contractController: ContractController;
  servicePackController: ServicePackController;
  coinController: CoinController;
  clientController: ClientController;
  companyController: CompanyController;
}

export async function createContract({
  contractController,
  clientController,
  coinController,
  companyController,
  servicePackController,
}: CreateContractOptions): Promise<CreateContractResponseDto> {
  const [servicePack, company, client] = await Promise.all([
    createServicePack({
      servicePackController,
      coinController,
    }),
    createCompany({ companyController }),
    createClient({ clientController }),
  ]);

  const createContractDto: CreateContractDto = {
    servicePackId: servicePack.id,
    companyId: company.id,
    clientId: client.id,
    coinId: servicePack.coin.id,
    expiresAt: new Date(),
    subscriptionPrice: randomInt(100),
    monthlyPayment: randomInt(100),
    lateFee: randomInt(10),
    monthlyFee: randomInt(10),
  };

  return contractController.create(createContractDto);
}
