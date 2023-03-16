import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleConfig } from '../../config/typeorm/typeorm-module.config';
import { TokenDurationType } from '../token/entity/token-duration-type.entity';
import { TokenType } from '../token/entity/token-type.entity';
import { Token } from '../token/entity/token.entity';
import { UserType } from '../user-type/entity/user-type.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(
      typeOrmModuleConfig([
        UserType,
        User,
        Token,
        TokenDurationType,
        TokenType,
      ]),
    ),
  ],
})
export class TypeormPostgresModule {}
