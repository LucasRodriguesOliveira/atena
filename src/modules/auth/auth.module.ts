import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWTModuleConfig } from '../../config/jwt/jwt-module.config';
import { User } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { JWTService } from './jwt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(JWTModuleConfig()),
    UserModule,
  ],
  providers: [JWTService, UserModule, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
