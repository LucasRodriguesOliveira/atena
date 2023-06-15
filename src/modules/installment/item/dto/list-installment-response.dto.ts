import { ApiProperty } from '@nestjs/swagger';
import { randomInt, randomUUID } from 'crypto';
import { Company } from '../../../company/entity/company.entity';
import { ServicePack } from '../../../service-pack/service/entity/service-pack.entity';
import { Contract } from '../../../contract/entity/contract.entity';
import { InstallmentType } from '../../type/entity/installment-type.entity';
import { Coin } from '../../../coin/entity/coin.entity';
import { Installment } from '../entity/installment.entity';
import { PaginatedResult } from '../../../../shared/paginated-result.interface';

export class ListItemInstallmentContractCompany {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'CPNY co.',
  })
  name: string;

  static from({ id, name }: Company): ListItemInstallmentContractCompany {
    return {
      id,
      name,
    };
  }
}

export class ListItemInstallmentContractServicePack {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Pro',
  })
  description: string;

  static from({
    id,
    description,
  }: ServicePack): ListItemInstallmentContractServicePack {
    return {
      id,
      description,
    };
  }
}

export class ListItemInstallmentContract {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: ListItemInstallmentContractCompany,
  })
  company: ListItemInstallmentContractCompany;

  @ApiProperty({
    type: ListItemInstallmentContractServicePack,
  })
  servicePack: ListItemInstallmentContractServicePack;

  static from({
    id,
    company,
    servicePack,
  }: Contract): ListItemInstallmentContract {
    return {
      id,
      company: ListItemInstallmentContractCompany.from(company),
      servicePack: ListItemInstallmentContractServicePack.from(servicePack),
    };
  }
}

export class ListItemInstallmentType {
  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Monthly Payment',
  })
  description: string;

  static from({ id, description }: InstallmentType): ListItemInstallmentType {
    return {
      id,
      description,
    };
  }
}

export class ListItemInstallmentCoin {
  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'BRL',
  })
  acronym: string;

  static from({ id, acronym }: Coin): ListItemInstallmentCoin {
    return {
      id,
      acronym,
    };
  }
}

export class ListItemInstallmentResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: ListItemInstallmentContract,
  })
  contract: ListItemInstallmentContract;

  @ApiProperty({
    type: ListItemInstallmentType,
  })
  installmentType: ListItemInstallmentType;

  @ApiProperty({
    type: ListItemInstallmentCoin,
  })
  coin: ListItemInstallmentCoin;

  @ApiProperty({
    type: Boolean,
  })
  isPaid: boolean;

  @ApiProperty({
    type: Boolean,
  })
  isPaymentDivergent: boolean;

  @ApiProperty({
    type: Number,
  })
  value: number;

  @ApiProperty({
    type: Date,
  })
  expiresAt: Date;

  static from({
    id,
    contract,
    installmentType,
    coin,
    paidAt,
    value,
    valuePaid,
    expiresAt,
  }: Installment): ListItemInstallmentResponseDto {
    return {
      id,
      contract: ListItemInstallmentContract.from(contract),
      installmentType: ListItemInstallmentType.from(installmentType),
      coin: ListItemInstallmentCoin.from(coin),
      isPaid: paidAt !== null,
      isPaymentDivergent: value !== valuePaid,
      value,
      expiresAt,
    };
  }
}

export class ListInstallmentResponseDto
  implements PaginatedResult<ListItemInstallmentResponseDto>
{
  @ApiProperty({
    type: ListItemInstallmentResponseDto,
    isArray: true,
  })
  data: ListItemInstallmentResponseDto[];

  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
  })
  total: number;

  static from(
    installments: Installment[],
    total: number,
  ): ListInstallmentResponseDto {
    return {
      data: installments.map(ListItemInstallmentResponseDto.from),
      total,
    };
  }
}
