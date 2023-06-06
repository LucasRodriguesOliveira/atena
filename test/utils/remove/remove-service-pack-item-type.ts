import { ServicePackItemType } from '../../../src/modules/service-pack-item-type/entity/service-pack-item-type.entity';
import { repository } from '../repository';
import { IRemoveOptions } from './iremove-options.interface';
import { Repository } from 'typeorm';

export async function removeServicePackItemType({
  id,
}: IRemoveOptions): Promise<boolean> {
  const servicePackItemTypeRepository = repository.get(
    ServicePackItemType.name,
  ) as Repository<ServicePackItemType>;
  const { affected } = await servicePackItemTypeRepository.delete({ id });

  return affected > 0;
}
