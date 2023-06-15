import { ApiProperty } from '@nestjs/swagger';
import { InstallmentType } from '../entity/installment-type.entity';
import { randomInt } from 'crypto';

export class UpdateInstallmentTypeResponseDto {
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
  updatedAt: Date;

  static from({
    id,
    description,
    status,
    updatedAt,
  }: InstallmentType): UpdateInstallmentTypeResponseDto {
    return {
      id,
      description,
      status,
      updatedAt,
    };
  }
}
