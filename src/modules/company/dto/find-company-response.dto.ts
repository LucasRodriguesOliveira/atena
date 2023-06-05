import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Company } from '../entity/company.entity';

export class FindCompanyResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'CPNY. LTDA.',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'Great Company',
  })
  displayName: string;

  @ApiProperty({
    type: String,
    example: 'greatcpny@email.com',
  })
  email: string;

  static from({
    id,
    name,
    displayName,
    email,
  }: Company): FindCompanyResponseDto {
    return {
      id,
      name,
      displayName,
      email,
    };
  }
}
