import { ApiProperty } from '@nestjs/swagger';
import { Coin } from '../entity/coin.entity';

export class CreateCoinResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Euro',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'EUR',
  })
  acronym: string;

  @ApiProperty({
    type: Number,
    example: 1.07,
  })
  value: number;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  static from({
    id,
    name,
    acronym,
    value,
    createdAt,
  }: Coin): CreateCoinResponseDto {
    return {
      id,
      name,
      acronym,
      value,
      createdAt,
    };
  }
}
