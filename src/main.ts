import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './config/env/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  await app.listen(appConfig.port);
}
bootstrap();
