import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envConfig } from './config/env/env.config';
import { AuthModule } from './modules/auth/auth.module';
import { TypeormPostgresModule } from './modules/typeorm/typeorm.module';

@Module({
  imports: [ConfigModule.forRoot(envConfig), TypeormPostgresModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
