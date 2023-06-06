import { ApiProperty } from '@nestjs/swagger';
import { ServicePackItemType } from '../entity/service-pack-item-type.entity';

export class ListServicePackItemTypeResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'TOP_PAGE_7_DAYS',
  })
  description: string;

  static map({
    id,
    description,
  }: ServicePackItemType): ListServicePackItemTypeResponseDto {
    return {
      id,
      description,
    };
  }

  static from(
    servicePackItemTypes: ServicePackItemType[],
  ): ListServicePackItemTypeResponseDto[] {
    return servicePackItemTypes.map((servicePackItemType) =>
      ListServicePackItemTypeResponseDto.map(servicePackItemType),
    );
  }
}
