import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Company } from '../entity/company.entity';
import { PaginatedResult } from '../../../shared/paginated-result.interface';

export class ListCompanyResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'CPNY LTDA',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'Great Company',
  })
  displayName: string;

  private static map({
    id,
    name,
    displayName,
  }: Company): ListCompanyResponseDto {
    return {
      id,
      name,
      displayName,
    };
  }

  static from({
    companies,
    total,
  }: {
    companies: Company[];
    total: number;
  }): PaginatedResult<ListCompanyResponseDto> {
    return {
      data: companies.map(ListCompanyResponseDto.map),
      total,
    };
  }
}
