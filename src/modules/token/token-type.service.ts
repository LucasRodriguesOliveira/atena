import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenType } from './entity/token-type.entity';
import { TokenTypeEnum } from './type/token-type.enum';

@Injectable()
export class TokenTypeService {
  constructor(
    @InjectRepository(TokenType)
    private readonly tokenTypeRepository: Repository<TokenType>,
  ) {}

  public async find(description: TokenTypeEnum): Promise<TokenType> {
    return this.tokenTypeRepository.findOneBy({
      description,
    });
  }
}
