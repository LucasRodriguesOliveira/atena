import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { LoginDto } from 'src/modules/auth/dto/login.dto';

const loginDto: LoginDto = {
  username: 'test',
  password: '12345',
  remember: false,
};

export function getTokenFactory(
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
