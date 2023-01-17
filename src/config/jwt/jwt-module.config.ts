import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JWTConfig } from '../env/jwt.config';

export const JWTModuleConfig = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService],
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const { secret } = configService.get<JWTConfig>('jwt');

    return {
      secret,
    };
  },
});
