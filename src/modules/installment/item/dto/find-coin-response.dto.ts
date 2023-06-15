import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { Coin } from '../../../coin/entity/coin.entity';

export class FindCoinResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Real',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'BRL',
  })
  acronym: string;

  static from({ id, name, acronym }: Coin): FindCoinResponseDto {
    return {
      id,
      name,
      acronym,
    };
  }
}
