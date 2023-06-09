import { ApiProperty } from '@nestjs/swagger';
import { FindServicePackItemTypeResponseDto } from './find-service-pack-item-type-response.dto';
import { FindServicePackResponseDto } from './find-service-pack-response.dto';
import { ServicePackItem } from '../entity/service-pack-item.entity';

export class FindServicePackItemResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: FindServicePackResponseDto,
  })
  servicePack: FindServicePackResponseDto;

  @ApiProperty({
    type: FindServicePackItemTypeResponseDto,
  })
  itemType: FindServicePackItemTypeResponseDto;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  amount: number;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  status: boolean;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  static from({
    id,
    servicePack,
    itemType,
    amount,
    status,
    createdAt,
  }: ServicePackItem): FindServicePackItemResponseDto {
    return {
      id,
      servicePack: FindServicePackResponseDto.from(servicePack),
      itemType: FindServicePackItemTypeResponseDto.from(itemType),
      amount,
      status,
      createdAt,
    };
  }
}
