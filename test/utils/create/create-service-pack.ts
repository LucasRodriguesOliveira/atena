import { CoinController } from '../../../src/modules/coin/coin.controller';
import { CreateServicePackResponseDto } from '../../../src/modules/service-pack/service-pack/dto/create-service-pack-response.dto';
import { CreateServicePackDto } from '../../../src/modules/service-pack/service-pack/dto/create-service-pack.dto';
import { ServicePackController } from '../../../src/modules/service-pack/service-pack/service-pack.controller';
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
    name: 'TEST_COIN',
    description: 'TEST_COIN',
    duration: 1,
    lateFee: 1,
    monthlyFee: 1,
    monthlyPayment: 1,
    subscriptionPrice: 1,
    coinId,
  };

  return servicePackController.create(createServicePackDto);
}
