import { CreateServicePackItemTypeResponseDto } from '../../../src/modules/service-pack-item-type/dto/create-service-pack-item-type-response.dto';
import { CreateServicePackItemTypeDto } from '../../../src/modules/service-pack-item-type/dto/create-service-pack-item-type.dto';
import { ServicePackItemTypeController } from '../../../src/modules/service-pack-item-type/service-pack-item-type.controller';

interface CreateServicePackItemTypeOptions {
  servicePackItemTypeController: ServicePackItemTypeController;
}

export async function createServicePackItemType({
  servicePackItemTypeController,
}: CreateServicePackItemTypeOptions): Promise<CreateServicePackItemTypeResponseDto> {
  const createServicePackItemTypeDto: CreateServicePackItemTypeDto = {
    description: 'TEST_SERVICE_PACK_ITEM_TYPE',
  };

  return servicePackItemTypeController.create(createServicePackItemTypeDto);
}
