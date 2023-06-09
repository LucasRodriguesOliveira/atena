import { ApiProperty } from '@nestjs/swagger';
import { FindServicePackItemTypeResponseDto } from './find-service-pack-item-type-response.dto';
import { FindServicePackResponseDto } from './find-service-pack-response.dto';
import { ServicePackItem } from '../entity/service-pack-item.entity';

export class CreateServicePackItemResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: FindServicePackItemTypeResponseDto,
  })
  itemType: FindServicePackItemTypeResponseDto;

  @ApiProperty({
    type: FindServicePackResponseDto,
  })
  servicePack: FindServicePackResponseDto;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  amount: number;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  static from({
    id,
    itemType,
    servicePack,
    amount,
    createdAt,
  }: ServicePackItem): CreateServicePackItemResponseDto {
    return {
      id,
      itemType: FindServicePackItemTypeResponseDto.from(itemType),
      servicePack: FindServicePackResponseDto.from(servicePack),
      amount,
      createdAt,
    };
  }
}
