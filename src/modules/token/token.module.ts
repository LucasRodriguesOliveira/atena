import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWTModuleConfig } from 'src/config/jwt/jwt-module.config';
import { AuthModule } from '../auth/auth.module';
import { JWTService } from '../auth/jwt.service';
import { User } from '../user/entity/user.entity';
import { TokenDurationType } from './entity/token-duration-type.entity';
import { TokenType } from './entity/token-type.entity';
import { Token } from './entity/token.entity';
import { TokenDurationTypeController } from './token-duration-type.controller';
import { TokenDurationTypeService } from './token-duration-type.service';
import { TokenTypeController } from './token-type.controller';
import { TokenTypeService } from './token-type.service';
import { TokenService } from './token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, TokenType, TokenDurationType, User]),
    ConfigModule,
    JwtModule.registerAsync(JWTModuleConfig()),
  ],
  providers: [
    TokenService,
    TokenTypeService,
    TokenDurationTypeService,
    JWTService,
  ],
  controllers: [TokenTypeController, TokenDurationTypeController],
})
export class TokenModule {}
