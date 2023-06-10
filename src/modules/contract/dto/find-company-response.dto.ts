import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Company } from '../../company/entity/company.entity';

export class FindCompanyResponseDto {
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

  static from({ id, name }: Company): FindCompanyResponseDto {
    return {
      id,
      name,
    };
  }
}
