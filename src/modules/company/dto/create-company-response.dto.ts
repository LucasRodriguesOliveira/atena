import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Company } from '../entity/company.entity';

export class CreateCompanyResponseDto {
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

  @ApiProperty({
    type: String,
    example: 'great_cpny@email.com',
  })
  email: string;

  static from({
    id,
    name,
    displayName,
    email,
  }: Company): CreateCompanyResponseDto {
    return {
      id,
      name,
      displayName,
      email,
    };
  }
}
