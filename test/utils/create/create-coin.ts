import { CoinController } from '../../../src/modules/coin/coin.controller';
import { CreateCoinResponseDto } from '../../../src/modules/coin/dto/create-coin-response.dto';
import { CreateCoinDto } from '../../../src/modules/coin/dto/create-coin.dto';

interface CreateCoinOptions {
  coinController: CoinController;
}

export async function createCoin({
  coinController,
}: CreateCoinOptions): Promise<CreateCoinResponseDto> {
  const createCoinDto: CreateCoinDto = {
    name: 'test',
    acronym: 'any',
    value: 1,
  };

  return coinController.create(createCoinDto);
}
