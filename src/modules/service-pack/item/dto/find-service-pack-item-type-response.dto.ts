import { ApiProperty } from '@nestjs/swagger';
import { ServicePackItemType } from '../../item-type/entity/service-pack-item-type.entity';

export class FindServicePackItemTypeResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'TOP_PAGE',
  })
  description: string;

  static from({
    id,
    description,
  }: ServicePackItemType): FindServicePackItemTypeResponseDto {
    return {
      id,
      description,
    };
  }
}
