import { ApiProperty } from '@nestjs/swagger';
import { Coin } from '../../../coin/entity/coin.entity';

export class FindCoinServicePackReponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'BRL',
  })
  acronym: string;

  static from({ id, acronym }: Coin): FindCoinServicePackReponseDto {
    return {
      id,
      acronym,
    };
  }
}
