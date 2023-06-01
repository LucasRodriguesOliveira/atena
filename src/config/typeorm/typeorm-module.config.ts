import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmConfig } from '../env/typeorm.config';

export const typeOrmModuleConfig = (entities): TypeOrmModuleAsyncOptions => ({
  inject: [ConfigService],
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const { database, host, password, port, username } =
      configService.get<TypeOrmConfig>('database');
    const { NODE_ENV: env } = process.env;

    return {
      type: 'postgres',
      host,
      port,
      password,
      username,
      database,
      synchronize: true,
      entities,
      logging: !['develop', 'dev', 'development'].includes(env),
    };
  },
});
