import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWTModuleConfig } from '../../config/jwt/jwt-module.config';
import { TokenModule } from '../token/token.module';
import { TokenService } from '../token/token.service';
import { UserModule } from '../user/user.module';
import { JWTService } from './jwt.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(JWTModuleConfig()),
    UserModule,
    TokenModule,
  ],
  providers: [JWTService, UserModule, TokenService],
})
export class AuthModule {}
