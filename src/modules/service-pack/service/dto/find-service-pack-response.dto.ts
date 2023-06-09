import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { ServicePack } from '../entity/service-pack.entity';
import { FindCoinServicePackReponseDto } from './find-coin-service-pack-response.dto';

export class FindServicePackResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Basic',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'New here? Perfect Service Pack to start!',
  })
  description: string;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'in months',
  })
  duration: number;

  @ApiProperty({
    type: Number,
    description:
      'Starting value to subscribe to the service pack and sign a contract',
    example: 300.0,
  })
  subscriptionPrice: number;

  @ApiProperty({
    type: Number,
    description: 'Monthly payment agreed upon contract',
    example: 50.0,
  })
  monthlyPayment: number;

  @ApiProperty({
    type: Number,
    description: `Fee tax applied to monthly payment due to expired payment.
    1 = 100%; 0.15 = 15%; 15% of 50.0 = 7.5 added to the value = 57.5`,
    example: 0.15,
  })
  lateFee: number;

  @ApiProperty({
    type: Number,
    description: `Fee tax applied to monthly payment due to expired payment.
    Applied monthly as compound interest.
    57.5 * 1.01 = 58.075 in the first month.
    58.075 * 1.01 = 58.6557 in the second month.`,
    example: 0.01,
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
    coin,
    status,
    createdAt,
  }: ServicePack): FindServicePackResponseDto {
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
