import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWTModuleConfig } from '../../config/jwt/jwt-module.config';
import { TokenDurationType } from '../token/entity/token-duration-type.entity';
import { TokenType } from '../token/entity/token-type.entity';
import { Token } from '../token/entity/token.entity';
import { TokenDurationTypeService } from '../token/token-duration-type.service';
import { TokenTypeService } from '../token/token-type.service';
import { TokenModule } from '../token/token.module';
import { TokenService } from '../token/token.service';
import { User } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { JWTService } from './jwt.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Token, TokenType, TokenDurationType]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(JWTModuleConfig()),
    UserModule,
    TokenModule,
  ],
  providers: [
    JWTService,
    UserModule,
    TokenService,
    TokenTypeService,
    TokenDurationTypeService,
  ],
})
export class AuthModule {}
