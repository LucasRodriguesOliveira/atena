import { ApiProperty } from '@nestjs/swagger';
import { Coin } from '../entity/coin.entity';

export class ListCoinResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
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

  static map({ id, name, acronym }: Coin): ListCoinResponseDto {
    return {
      id,
      name,
      acronym,
    };
  }

  static from(coins: Coin[]): ListCoinResponseDto[] {
    return coins.map((coin) => ListCoinResponseDto.map(coin));
  }
}
