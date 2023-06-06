import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { UserCompany } from '../entity/user-company.entity';

export class CreateUserCompanyResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  companyId: string;

  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  userId: string;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  static from({
    id,
    company,
    user,
    createdAt,
  }: UserCompany): CreateUserCompanyResponseDto {
    return {
      id,
      companyId: company.id,
      userId: user.id,
      createdAt,
    };
  }
}
