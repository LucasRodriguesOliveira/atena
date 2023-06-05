import { CreateUserTypeResponse } from '../../../src/modules/user-type/dto/create-user-type-response.dto';
import { CreateUserTypeDto } from '../../../src/modules/user-type/dto/create-user-type.dto';
import { UserTypeController } from '../../../src/modules/user-type/user-type.controller';

interface CreateUserTypeOptions {
  userTypeController: UserTypeController;
}

export async function createUserType({
  userTypeController,
}: CreateUserTypeOptions): Promise<CreateUserTypeResponse> {
  const createUserTypeDto: CreateUserTypeDto = {
    description: 'TEST_USER_TYPE',
  };

  return userTypeController.create(createUserTypeDto);
}
