import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { InstallmentType } from '../entity/installment-type.entity';

export class ListInstallmentTypeResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Monthly Payment',
  })
  description: string;

  static map({
    id,
    description,
  }: InstallmentType): ListInstallmentTypeResponseDto {
    return {
      id,
      description,
    };
  }

  static from(
    installmentTypes: InstallmentType[],
  ): ListInstallmentTypeResponseDto[] {
    return installmentTypes.map(ListInstallmentTypeResponseDto.map);
  }
}
