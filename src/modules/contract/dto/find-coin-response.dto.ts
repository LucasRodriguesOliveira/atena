import { ApiProperty } from '@nestjs/swagger';
import { Coin } from '../../coin/entity/coin.entity';

export class FindCoinResponseDto {
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

  static from({ id, name }: Coin): FindCoinResponseDto {
    return {
      id,
      name,
    };
  }
}
