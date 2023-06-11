import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { InstallmentType } from '../entity/installment-type.entity';

export class CreateInstallmentTypeResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Subscription Payment',
  })
  description: string;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  status: boolean;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  static from({
    id,
    description,
    status,
    createdAt,
  }: InstallmentType): CreateInstallmentTypeResponseDto {
    return {
      id,
      description,
      status,
      createdAt,
    };
  }
}
