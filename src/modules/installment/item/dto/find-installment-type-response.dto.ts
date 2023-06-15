import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { InstallmentType } from '../../type/entity/installment-type.entity';

export class FindInstallmentTypeResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Service Subscription',
  })
  description: string;

  static from({
    id,
    description,
  }: InstallmentType): FindInstallmentTypeResponseDto {
    return {
      id,
      description,
    };
  }
}
