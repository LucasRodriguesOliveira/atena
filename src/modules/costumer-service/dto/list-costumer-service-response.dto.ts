import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResult } from '../../../shared/paginated-result.interface';
import { CostumerService } from '../entity/costumer-service.entity';
import { FindCostumerServiceResponseDto } from './find-costumer-service-response.dto';
import { randomInt } from 'crypto';

export class ListCostumerServiceResponseDto
  implements PaginatedResult<FindCostumerServiceResponseDto>
{
  @ApiProperty({
    type: FindCostumerServiceResponseDto,
    isArray: true,
  })
  data: FindCostumerServiceResponseDto[];

  @ApiProperty({
    type: Number,
    example: randomInt(1, 100),
  })
  total: number;

  static from(
    costumerServices: CostumerService[],
    total,
  ): ListCostumerServiceResponseDto {
    return {
      data: costumerServices.map(FindCostumerServiceResponseDto.from),
      total: total,
    };
  }
}
