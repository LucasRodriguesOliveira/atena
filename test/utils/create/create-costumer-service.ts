import { AuthController } from '../../../src/modules/auth/auth.controller';
import { ClientController } from '../../../src/modules/client/client.controller';
import { CostumerServiceController } from '../../../src/modules/costumer-service/costumer-service.controller';
import { CreateCostumerServiceDto } from '../../../src/modules/costumer-service/dto/create-costumer-service.dto';
import { FindCostumerServiceResponseDto } from '../../../src/modules/costumer-service/dto/find-costumer-service-response.dto';
import { ServiceStageController } from '../../../src/modules/service-stage/service-stage.controller';
import { UserTypeEnum } from '../../../src/modules/user-type/type/user-type.enum';
import { User } from '../../../src/modules/user/entity/user.entity';
import { RepositoryManager } from '../repository';
import { createClient } from './create-client';
import { createServiceStage } from './create-service-stage';
import { createUser } from './create-user';

interface CreateCostumerServiceOptions {
  costumerServiceController: CostumerServiceController;
  clientController: ClientController;
  authController: AuthController;
  serviceStageController: ServiceStageController;
  repositoryManager: RepositoryManager;
}

export async function createCostumerService({
  clientController,
  costumerServiceController,
  serviceStageController,
  authController,
  repositoryManager,
}: CreateCostumerServiceOptions): Promise<FindCostumerServiceResponseDto> {
  const [client, username, serviceStage] = await Promise.all([
    createClient({ clientController }),
    createUser({
      authController,
      userType: UserTypeEnum.DEFAULT,
      override: true,
      testName: 'createcostumer',
    }),
    createServiceStage({ serviceStageController }),
  ]);

  const { id: userId } = await repositoryManager.find<User>(User.name, {
    username,
  });

  const createCostumerServiceDto: CreateCostumerServiceDto = {
    clientId: client.id,
    userId,
    serviceStageId: serviceStage.id,
  };

  return costumerServiceController.create(createCostumerServiceDto);
}
