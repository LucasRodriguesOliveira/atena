import { ApiProperty } from '@nestjs/swagger';
import { FindInstallmentResponseDto } from './find-installment-respose.dto';
import { Installment } from '../entity/installment.entity';

export class UpdateInstallmentResponseDto extends FindInstallmentResponseDto {
  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  static from(installment: Installment): UpdateInstallmentResponseDto {
    return {
      ...FindInstallmentResponseDto.from(installment),
      updatedAt: installment.updatedAt,
    };
  }
}
