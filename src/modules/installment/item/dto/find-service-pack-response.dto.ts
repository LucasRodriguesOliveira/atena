import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { ServicePack } from '../../../service-pack/service/entity/service-pack.entity';

export class FindServicePackResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Pro',
  })
  name: string;

  static from({ id, name }: ServicePack): FindServicePackResponseDto {
    return {
      id,
      name,
    };
  }
}
