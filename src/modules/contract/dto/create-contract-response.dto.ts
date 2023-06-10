import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { FindServicePackResponseDto } from './find-service-pack-response.dto';
import { FindCompanyResponseDto } from './find-company-response.dto';
import { Contract } from '../entity/contract.entity';

export class CreateContractResponseDto {
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

  static from({
    id,
    servicePack,
    company,
  }: Contract): CreateContractResponseDto {
    return {
      id,
      servicePack: FindServicePackResponseDto.from(servicePack),
      company: FindCompanyResponseDto.from(company),
    };
  }
}
