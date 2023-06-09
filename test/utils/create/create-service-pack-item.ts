import { ServicePackItemController } from 'src/modules/service-pack/item/service-pack-item.controller';
import { CreateServicePackItemDto } from 'src/modules/service-pack/item/dto/create-service-pack-item.dto';
import { CreateServicePackItemResponseDto } from 'src/modules/service-pack/item/dto/create-service-pack-item-response.dto';
import { createServicePack } from './create-service-pack';
import { ServicePackController } from 'src/modules/service-pack/service/service-pack.controller';
import { CoinController } from 'src/modules/coin/coin.controller';
import { createServicePackItemType } from './create-service-pack-item-type';
import { ServicePackItemTypeController } from 'src/modules/service-pack/item-type/service-pack-item-type.controller';

interface CreateServicePackItemOptions {
  servicePackItemController: ServicePackItemController;
  servicePackController: ServicePackController;
  servicePackItemTypeController: ServicePackItemTypeController;
  coinController: CoinController;
}

export async function createServicePackItem({
  servicePackItemController,
  servicePackController,
  servicePackItemTypeController,
  coinController,
}: CreateServicePackItemOptions): Promise<CreateServicePackItemResponseDto> {
  const [servicePack, itemType] = await Promise.all([
    createServicePack({
      servicePackController,
      coinController,
    }),
    createServicePackItemType({ servicePackItemTypeController }),
  ]);

  const createServicePackItemDto: CreateServicePackItemDto = {
    amount: 1,
    servicePackId: servicePack.id,
    itemTypeId: itemType.id,
  };

  return servicePackItemController.create(createServicePackItemDto);
}
