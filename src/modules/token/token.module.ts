import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { JWTService } from '../auth/jwt.service';
import { TokenDurationType } from './entity/token-duration-type.entity';
import { TokenType } from './entity/token-type.entity';
import { Token } from './entity/token.entity';
import { TokenTypeService } from './token-type.service';
import { TokenService } from './token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, TokenType, TokenDurationType]),
    AuthModule,
  ],
  providers: [TokenService, TokenTypeService, JWTService],
})
export class TokenModule {}
