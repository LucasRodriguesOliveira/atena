import { ConfigModuleOptions } from '@nestjs/config';
import { envSchema } from '../schema/env.schema';
import { appConfig } from './app.config';
import { jwtConfig } from './jwt.config';
import { swaggerConfig } from './swagger.config';
import { typeOrmConfig } from './typeorm.config';

const filePath = (env: string): string => {
  if (['development', 'develop', 'dev'].includes(env.toLocaleLowerCase())) {
    return '.env';
  }

  if (env.toLocaleLowerCase() == 'test') {
    return '.env.test';
  }

  return '.env';
};

export const envConfig: ConfigModuleOptions = {
  load: [appConfig, typeOrmConfig, jwtConfig, swaggerConfig],
  validationSchema: envSchema,
  envFilePath: filePath(process.env.NODE_ENV),
};
