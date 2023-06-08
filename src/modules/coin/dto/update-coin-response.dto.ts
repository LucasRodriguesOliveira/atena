import { ApiProperty } from '@nestjs/swagger';
import { Coin } from '../entity/coin.entity';

export class UpdateCoinResponseDto {
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

  @ApiProperty({
    type: Number,
    example: 0.2,
  })
  value: number;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  status: boolean;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  static from({
    id,
    name,
    acronym,
    value,
    status,
    createdAt,
    updatedAt,
  }: Coin): UpdateCoinResponseDto {
    return {
      id,
      name,
      acronym,
      value,
      status,
      createdAt,
      updatedAt,
    };
  }
}
