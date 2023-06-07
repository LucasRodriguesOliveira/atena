import { Coin } from '../../../src/modules/coin/entity/coin.entity';
import { repository } from '../repository';
import { IRemoveOptions } from './iremove-options.interface';
import { Repository } from 'typeorm';

export async function removeCoin({ id }: IRemoveOptions): Promise<boolean> {
  const coinRepository = repository.get(Coin.name) as Repository<Coin>;
  const { affected } = await coinRepository.delete({ id });

  return affected > 0;
}
