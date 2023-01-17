import { ConfigModuleOptions } from '@nestjs/config';
import { envSchema } from '../schema/env.schema';
import { appConfig } from './app.config';
import { jwtConfig } from './jwt.config';
import { typeOrmConfig } from './typeorm.config';

export const envConfig: ConfigModuleOptions = {
  load: [appConfig, typeOrmConfig, jwtConfig],
  validationSchema: envSchema,
};
