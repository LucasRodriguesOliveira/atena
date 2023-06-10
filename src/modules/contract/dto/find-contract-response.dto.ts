import { ApiProperty } from '@nestjs/swagger';
import { FindClientResponseDto } from './find-client-response.dto';
import { FindCoinResponseDto } from './find-coin-response.dto';
import { FindCompanyResponseDto } from './find-company-response.dto';
import { FindServicePackResponseDto } from './find-service-pack-response.dto';
import { randomUUID } from 'crypto';
import { Contract } from '../entity/contract.entity';

export class FindContractResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: FindServicePackResponseDto,
  })
  servicePack: FindServicePackResponseDto;

  @ApiProperty({
    type: FindCompanyResponseDto,
  })
  company: FindCompanyResponseDto;

  @ApiProperty({
    type: FindClientResponseDto,
  })
  client: FindClientResponseDto;

  @ApiProperty({
    type: FindCoinResponseDto,
  })
  coin: FindCoinResponseDto;

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
    type: Date,
  })
  expiresAt: Date;

  @ApiProperty({
    type: Boolean,
  })
  status: boolean;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  static from({
    id,
    servicePack,
    coin,
    company,
    client,
    createdAt,
    expiresAt,
    lateFee,
    monthlyFee,
    monthlyPayment,
    status,
    subscriptionPrice,
  }: Contract): FindContractResponseDto {
    return {
      id,
      servicePack: FindServicePackResponseDto.from(servicePack),
      company: FindCompanyResponseDto.from(company),
      client: FindClientResponseDto.from(client),
      coin: FindCoinResponseDto.from(coin),
      subscriptionPrice,
      monthlyPayment,
      lateFee,
      monthlyFee,
      expiresAt,
      status,
      createdAt,
    };
  }
}
