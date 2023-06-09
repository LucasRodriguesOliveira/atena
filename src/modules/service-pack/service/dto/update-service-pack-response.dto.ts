import { ApiProperty } from '@nestjs/swagger';
import { ServicePack } from '../entity/service-pack.entity';
import { FindCoinServicePackReponseDto } from './find-coin-service-pack-response.dto';
import { randomUUID } from 'crypto';

export class UpdateServicePackResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Pro',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'Professional Services',
  })
  description: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  duration: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  subscriptionPrice: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  monthlyPayment: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  lateFee: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  monthlyFee: number;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  status: boolean;

  @ApiProperty({
    type: FindCoinServicePackReponseDto,
  })
  coin: FindCoinServicePackReponseDto;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  static from({
    id,
    name,
    description,
    duration,
    subscriptionPrice,
    monthlyPayment,
    lateFee,
    monthlyFee,
    status,
    coin,
    updatedAt,
  }: ServicePack): UpdateServicePackResponseDto {
    return {
      id,
      name,
      description,
      duration,
      subscriptionPrice,
      monthlyPayment,
      lateFee,
      monthlyFee,
      status,
      coin: FindCoinServicePackReponseDto.from(coin),
      updatedAt,
    };
  }
}
