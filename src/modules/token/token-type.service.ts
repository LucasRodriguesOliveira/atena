import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTokenTypeResponse } from './dto/create-token-type-response.dto';
import { CreateTokenTypeDto } from './dto/create-token-type.dto';
import { TokenTypeListResponse } from './dto/token-type-list-response.dto';
import { UpdateTokenTypeDto } from './dto/update-token-type.dto';
import { TokenType } from './entity/token-type.entity';
import { TokenDurationTypeService } from './token-duration-type.service';
import { TokenTypeEnum } from './type/token-type.enum';

@Injectable()
export class TokenTypeService {
  constructor(
    @InjectRepository(TokenType)
    private readonly tokenTypeRepository: Repository<TokenType>,

    private readonly tokenDurationTypeService: TokenDurationTypeService,
  ) {}

  public async find(description: TokenTypeEnum): Promise<TokenType> {
    return this.tokenTypeRepository.findOneBy({
      description,
    });
  }

  public async findById(id: number): Promise<TokenType> {
    return this.tokenTypeRepository.findOneBy({ id });
  }

  public async list(): Promise<TokenTypeListResponse[]> {
    const tokenTypes = await this.tokenTypeRepository.find({
      relations: {
        durationType: true,
      },
      select: {
        id: true,
        description: true,
        durationAmount: true,
        durationType: {
          id: true,
        },
      },
    });

    return TokenTypeListResponse.from(tokenTypes);
  }

  public async create({
    description,
    durationAmount,
    durationTypeId,
  }: CreateTokenTypeDto): Promise<CreateTokenTypeResponse> {
    const durationType = await this.tokenDurationTypeService.find(
      durationTypeId,
    );
    const tokenType = this.tokenTypeRepository.create({
      description,
      durationAmount,
      durationType,
    });

    return CreateTokenTypeResponse.from(
      await this.tokenTypeRepository.save(tokenType),
    );
  }

  public async update(
    tokenTypeId: number,
    updateTokenTypeDto: UpdateTokenTypeDto,
  ): Promise<TokenType> {
    await this.tokenTypeRepository.update(
      { id: tokenTypeId },
      { ...updateTokenTypeDto },
    );

    return this.tokenTypeRepository.findOneBy({ id: tokenTypeId });
  }

  public async delete(tokenTypeId: number): Promise<boolean> {
    const { affected } = await this.tokenTypeRepository.softDelete({
      id: tokenTypeId,
    });

    return affected > 0;
  }
}
