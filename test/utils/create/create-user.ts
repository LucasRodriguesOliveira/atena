import { RegisterDto } from '../../../src/modules/auth/dto/register.dto';
import { AuthController } from '../../../src/modules/auth/auth.controller';
import { UserTypeEnum } from '../../../src/modules/user-type/type/user-type.enum';

interface CreateUserOptions {
  authController: AuthController;
  userType: UserTypeEnum;

  /**
   * Set this option when you want to receive userId to avoid any hook or test
   * to delete it by accident
   *
   * @example
   * ```
   * const userId = await createUser({
   *   authController,
   *   userType: 0,
   *   override: true,
   * });
   * ```
   *
   * @returns random `username`
   */
  override?: boolean;
}

export const registerDto: RegisterDto = {
  name: 'Testing User',
  username: 'test.test',
  password: 'testpassword',
  userTypeId: 1,
};

const getUserTypeId = (userType: UserTypeEnum) =>
  1 + Object.keys(UserTypeEnum).indexOf(userType);

interface TokenRegister {
  admin: RegisterDto;
  default: RegisterDto;
}

export const register: TokenRegister = {
  admin: {
    name: 'Admin Testing User',
    username: 'admin.test',
    password: 'admin_test_password',
    userTypeId: getUserTypeId(UserTypeEnum.ADMIN),
  },
  default: {
    name: 'Default Testing User',
    username: 'default.test',
    password: 'default_test_password',
    userTypeId: getUserTypeId(UserTypeEnum.DEFAULT),
  },
};

export async function createUser({
  authController,
  userType,
  override = false,
}: CreateUserOptions): Promise<string> {
  let user: RegisterDto;

  if (userType === UserTypeEnum.ADMIN) {
    user = { ...register.admin };
  }

  if (userType === UserTypeEnum.DEFAULT) {
    user = { ...register.default };
  }

  if (override) {
    user.username = `${user.username}/${Date.now()}`;
  }

  await authController.register(user);

  return user.username;
}
