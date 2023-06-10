import { ApiProperty } from '@nestjs/swagger';
import { FindCompanyResponseDto } from './find-company-response.dto';
import { FindServicePackResponseDto } from './find-service-pack-response.dto';
import { randomUUID } from 'crypto';
import { Contract } from '../entity/contract.entity';

export class UpdateContractResponseDto {
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
    type: Date,
  })
  updatedAt: Date;

  static from({
    id,
    servicePack,
    company,
    updatedAt,
  }: Contract): UpdateContractResponseDto {
    return {
      id,
      servicePack: FindServicePackResponseDto.from(servicePack),
      company: FindCompanyResponseDto.from(company),
      updatedAt,
    };
  }
}
