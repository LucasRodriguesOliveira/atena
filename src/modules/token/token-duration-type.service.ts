import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTokenDurationTypeDto } from './dto/create-token-duration-type.dto';
import { TokenDurationType } from './entity/token-duration-type.entity';

@Injectable()
export class TokenDurationTypeService {
  constructor(
    @InjectRepository(TokenDurationType)
    private readonly tokenDurationTypeRepository: Repository<TokenDurationType>,
  ) {}

  public async list(): Promise<TokenDurationType[]> {
    return this.tokenDurationTypeRepository.find({});
  }

  public async find(id: number): Promise<TokenDurationType> {
    return this.tokenDurationTypeRepository.findOneBy({ id });
  }

  public async create(
    createTokenDurationTypeDto: CreateTokenDurationTypeDto,
  ): Promise<TokenDurationType> {
    return this.tokenDurationTypeRepository.save(createTokenDurationTypeDto);
  }

  public async update(
    id: number,
    description: string,
  ): Promise<TokenDurationType> {
    await this.tokenDurationTypeRepository.update({ id }, { description });

    return this.tokenDurationTypeRepository.findOneBy({ id });
  }

  public async delete(id: number): Promise<boolean> {
    const { affected } = await this.tokenDurationTypeRepository.softDelete({
      id,
    });

    return affected > 0;
  }
}
