import { randomBytes } from 'crypto';
import { CreateServiceStageResponseDto } from '../../../src/modules/service-stage/dto/create-service-stage-response.dto';
import { CreateServiceStageDto } from '../../../src/modules/service-stage/dto/create-service-stage.dto';
import { ServiceStageController } from '../../../src/modules/service-stage/service-stage.controller';

interface CreateServiceStageOptions {
  serviceStageController: ServiceStageController;
}

export async function createServiceStage({
  serviceStageController,
}: CreateServiceStageOptions): Promise<CreateServiceStageResponseDto> {
  const createServiceStageDto: CreateServiceStageDto = {
    description: randomBytes(10).toString('hex'),
  };

  return serviceStageController.create(createServiceStageDto);
}
