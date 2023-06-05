import { ModuleController } from '../../../src/modules/module/module.controller';
import { CreateModuleResponse } from '../../../src/modules/module/dto/create-module-response.dto';
import { CreateModuleDto } from '../../../src/modules/module/dto/create-module.dto';

interface CreateModuleOptions {
  moduleController: ModuleController;
}

export async function createModule({
  moduleController,
}: CreateModuleOptions): Promise<CreateModuleResponse> {
  const createModuleDto: CreateModuleDto = {
    description: 'TEST_MODULE',
  };

  return moduleController.create(createModuleDto);
}
