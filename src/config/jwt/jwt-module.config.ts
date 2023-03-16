import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JWTConfig } from '../env/jwt.config';

export const JWTModuleConfig = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService],
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<JwtModuleOptions> => {
    const { secret } = configService.get<JWTConfig>('jwt');

    return {
      secret,
    };
  },
});
