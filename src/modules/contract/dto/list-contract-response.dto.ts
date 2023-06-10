import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResult } from '../../../shared/paginated-result.interface';
import { Contract } from '../entity/contract.entity';
import { FindCompanyResponseDto } from './find-company-response.dto';
import { FindServicePackResponseDto } from './find-service-pack-response.dto';
import { randomUUID } from 'crypto';

class ListItemContractResponseDto {
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

  static map({
    id,
    servicePack,
    company,
  }: Contract): ListItemContractResponseDto {
    return {
      id,
      servicePack: FindServicePackResponseDto.from(servicePack),
      company: FindCompanyResponseDto.from(company),
    };
  }

  static from(contracts: Contract[]): ListItemContractResponseDto[] {
    return contracts.map(ListItemContractResponseDto.map);
  }
}

export class ListContractResponseDto
  implements PaginatedResult<ListItemContractResponseDto>
{
  @ApiProperty({
    type: ListItemContractResponseDto,
    isArray: true,
  })
  data: ListItemContractResponseDto[];

  @ApiProperty({
    type: Number,
    example: 10,
  })
  count: number;

  static from(data: Contract[], count: number): ListContractResponseDto {
    return {
      data: ListItemContractResponseDto.from(data),
      count,
    };
  }
}
