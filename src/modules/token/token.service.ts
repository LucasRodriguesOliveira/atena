import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { TokenType } from './entity/token-type.entity';
import { Token } from './entity/token.entity';
import { TokenTypeService } from './token-type.service';
import { TokenTypeEnum } from './type/token-type.enum';
import * as crypto from 'crypto';
import { CreateLoginResponseDto } from './dto/create-login-response.dto';
import { JWTService } from '../auth/jwt.service';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly tokenTypeService: TokenTypeService,
    private readonly jwtService: JWTService,
  ) {}

  public async createLoginToken(
    user: User,
    isLongTerm: boolean,
  ): Promise<CreateLoginResponseDto> {
    const token: CreateLoginResponseDto = {
      token: '',
      longTermToken: '',
    };

    if (isLongTerm) {
      const longTerm = await this.createLongTermToken();
      token.longTermToken = longTerm.value;
    }

    token.token = await this.jwtService.sign(user);
    return token;
  }

  private async createLongTermToken(): Promise<Token> {
    const type: TokenType = await this.tokenTypeService.find(
      TokenTypeEnum.LOGIN_LONG_TERM,
    );
    const tokenValue = crypto.randomBytes(32).toString('hex');
    return this.tokenRepository.save({
      type,
      value: tokenValue,
    });
  }
}
