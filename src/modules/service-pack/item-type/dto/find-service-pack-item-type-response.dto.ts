import { ApiProperty } from '@nestjs/swagger';
import { ServicePackItemType } from '../entity/service-pack-item-type.entity';

export class FindServicePackItemTypeResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'USERS,PUBLICATIONS,TOP_PAGE_7_DAYS,...',
  })
  description: string;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  static from({ id, description, createdAt, updatedAt }: ServicePackItemType) {
    return {
      id,
      description,
      createdAt,
      updatedAt,
    };
  }
}
