import { CoinController } from '../../../src/modules/coin/coin.controller';
import { CreateServicePackResponseDto } from '../../../src/modules/service-pack/service/dto/create-service-pack-response.dto';
import { CreateServicePackDto } from '../../../src/modules/service-pack/service/dto/create-service-pack.dto';
import { ServicePackController } from '../../../src/modules/service-pack/service/service-pack.controller';
import { createCoin } from './create-coin';

interface CreateServicePackOptions {
  servicePackController: ServicePackController;
  coinController: CoinController;
}

export async function createServicePack({
  servicePackController,
  coinController,
}: CreateServicePackOptions): Promise<CreateServicePackResponseDto> {
  const { id: coinId } = await createCoin({ coinController });

  const createServicePackDto: CreateServicePackDto = {
    name: 'TEST_SERVICE_PACK',
    description: 'TEST_SERVICE_PACK',
    duration: 1,
    lateFee: 1,
    monthlyFee: 1,
    monthlyPayment: 1,
    subscriptionPrice: 1,
    coinId,
  };

  return servicePackController.create(createServicePackDto);
}
