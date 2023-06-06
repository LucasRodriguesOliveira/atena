import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { LoginDto } from '../../src/modules/auth/dto/login.dto';
import { createUser, register } from './create/create-user';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { UserTypeEnum } from '../../src/modules/user-type/type/user-type.enum';
import { removeAndCheck } from './remove-and-check';
import { removeUser } from './remove/remove-user';
import { addRepository } from './repository';
import { User } from '../../src/modules/user/entity/user.entity';
import { TestingModule } from '@nestjs/testing';

const loginDto: LoginDto = {
  username: 'test',
  password: '12345',
  remember: false,
};

export function getFakeTokenFactory(
  app: INestApplication,
  userService: { findByUsername: jest.Mock; comparePassword: jest.Mock },
): () => Promise<string> {
  const getToken = async (): Promise<string> => {
    userService.findByUsername.mockResolvedValueOnce({
      id: '0',
      password: '12345',
    });
    userService.comparePassword.mockResolvedValueOnce(true);

    const { text } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    return `bearer ${text}`;
  };

  return getToken;
}

interface RegisterOptions {
  authController: AuthController;
  testName?: string;
}

interface RegisterResponse {
  admin: LoginDto;
  default: LoginDto;
}

async function registerUser({
  authController,
  testName,
}: RegisterOptions): Promise<RegisterResponse> {
  const adminUsername = await createUser({
    authController,
    userType: UserTypeEnum.ADMIN,
    override: true,
    testName,
  });
  const defaultUsername = await createUser({
    authController,
    userType: UserTypeEnum.DEFAULT,
    override: true,
    testName,
  });

  return {
    admin: {
      username: adminUsername,
      password: register.admin.password,
      remember: false,
    },
    default: {
      username: defaultUsername,
      password: register.default.password,
      remember: false,
    },
  };
}

export interface TokenFactoryResponse {
  admin: () => Promise<string>;
  default: () => Promise<string>;
  clear: () => Promise<void>;
}

interface TokenFactoryOptions {
  testingModule: TestingModule;
  testName?: string;
}

export async function getTokenFactory({
  testingModule,
  testName,
}: TokenFactoryOptions): Promise<TokenFactoryResponse> {
  const authController = testingModule.get<AuthController>(AuthController);
  const login: RegisterResponse = await registerUser({
    authController,
    testName: `GetToken - ${testName}`,
  });

  addRepository({
    testingModule: testingModule,
    name: User.name,
  });

  return {
    admin: async (): Promise<string> => {
      let token: string;

      try {
        token = await authController.login(login.admin);
      } catch (err) {
        console.log(err);
      }

      return `bearer ${token}`;
    },
    default: async (): Promise<string> => {
      let token: string;

      try {
        token = await authController.login(login.default);
      } catch (err) {
        console.log(err);
      }

      return `bearer ${token}`;
    },
    clear: async (): Promise<void> => {
      await Promise.all([
        removeAndCheck({
          name: `User [${login.admin.username}]`,
          removeFunction: async () =>
            removeUser({ username: login.admin.username }),
        }),
        removeAndCheck({
          name: `User [${register.default.username}]`,
          removeFunction: async () =>
            removeUser({ username: login.default.username }),
        }),
      ]);
    },
  };
}
