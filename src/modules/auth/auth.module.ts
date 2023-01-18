import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWTModuleConfig } from '../../config/jwt/jwt-module.config';
import { UserModule } from '../user/user.module';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(JWTModuleConfig()),
    UserModule,
  ],
  providers: [JwtService, UserModule],
})
export class AuthModule {}
