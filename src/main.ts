import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';
import { AppConfig } from './config/env/app.config';
import { SwaggerConfig } from './config/env/swagger.config';
import { createSwaggerConfig } from './config/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  const swaggerDocument = createSwaggerConfig(app, configService);
  SwaggerModule.setup(swaggerConfig.path, app, swaggerDocument);

  await app.listen(appConfig.port);
}
bootstrap();
