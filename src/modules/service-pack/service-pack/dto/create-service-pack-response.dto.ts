import { ApiProperty } from '@nestjs/swagger';
import { FindCoinServicePackReponseDto } from './find-coin-service-pack-response.dto';
import { randomUUID } from 'crypto';
import { ServicePack } from '../entity/service-pack.entity';

export class CreateServicePackResponseDto {
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
    example: 'Professional services.',
  })
  description: string;

  @ApiProperty({
    type: Number,
    example: 12,
    description: 'in months',
  })
  duration: number;

  @ApiProperty({
    type: Number,
    example: 299.99,
  })
  subscriptionPrice: number;

  @ApiProperty({
    type: Number,
    example: 99.99,
  })
  monthlyPayment: number;

  @ApiProperty({
    type: Number,
    example: 0.07,
  })
  lateFee: number;

  @ApiProperty({
    type: Number,
    example: 0.0035,
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
  createdAt: Date;

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
    createdAt,
  }: ServicePack): CreateServicePackResponseDto {
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
      createdAt,
    };
  }
}
