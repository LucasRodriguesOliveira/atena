import { Installment } from '../entity/installment.entity';
import { ListItemInstallmentResponseDto } from './list-installment-response.dto';

export class CreateInstallmentResponseDto extends ListItemInstallmentResponseDto {
  static from(installment: Installment): ListItemInstallmentResponseDto {
    return ListItemInstallmentResponseDto.from(installment);
  }
}
