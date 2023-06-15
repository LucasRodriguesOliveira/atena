import { ApiProperty } from '@nestjs/swagger';
import { FindServicePackResponseDto } from './find-service-pack-response.dto';
import { randomUUID } from 'crypto';
import { Contract } from '../../../contract/entity/contract.entity';

export class FindContractResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: FindServicePackResponseDto,
  })
  servicePack: FindServicePackResponseDto;

  static from({ id, servicePack }: Contract): FindContractResponseDto {
    return {
      id,
      servicePack: FindServicePackResponseDto.from(servicePack),
    };
  }
}
