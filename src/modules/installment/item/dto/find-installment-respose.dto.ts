import { ApiProperty } from '@nestjs/swagger';
import { FindCoinResponseDto } from './find-coin-response.dto';
import { FindContractResponseDto } from './find-contract-response.dto';
import { FindPaymentMethodResponseDto } from './find-payment-method-response.dto';
import { randomInt, randomUUID } from 'crypto';
import { Installment } from '../entity/installment.entity';
import { FindInstallmentTypeResponseDto } from './find-installment-type-response.dto';

export class FindInstallmentResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: FindContractResponseDto,
  })
  contract: FindContractResponseDto;

  @ApiProperty({
    type: FindInstallmentTypeResponseDto,
  })
  installmentType: FindInstallmentTypeResponseDto;

  @ApiProperty({
    type: FindPaymentMethodResponseDto,
  })
  paymentMethod: FindPaymentMethodResponseDto;

  @ApiProperty({
    type: FindCoinResponseDto,
  })
  coin: FindCoinResponseDto;

  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
  })
  value: number;

  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
  })
  valuePaid: number;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  expiresAt: Date;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  paidAt: Date;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  static from({
    id,
    contract,
    installmentType,
    paymentMethod,
    coin,
    value,
    valuePaid,
    expiresAt,
    paidAt,
    createdAt,
  }: Installment): FindInstallmentResponseDto {
    return {
      id,
      contract: FindContractResponseDto.from(contract),
      installmentType: FindInstallmentTypeResponseDto.from(installmentType),
      paymentMethod: FindPaymentMethodResponseDto.from(paymentMethod),
      coin: FindCoinResponseDto.from(coin),
      value,
      valuePaid,
      expiresAt,
      paidAt,
      createdAt,
    };
  }
}
