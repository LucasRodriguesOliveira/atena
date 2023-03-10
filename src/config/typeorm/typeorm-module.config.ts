import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmConfig } from '../env/typeorm.config';

export const typeOrmModuleConfig = (entities): TypeOrmModuleAsyncOptions => ({
  inject: [ConfigService],
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const { database, host, password, port, username } =
      configService.get<TypeOrmConfig>('database');

    return {
      type: 'postgres',
      host,
      port,
      password,
      username,
      database,
      synchronize: true,
      entities,
    };
  },
});
