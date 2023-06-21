import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { ServiceStage } from '../entity/service-stage.entity';

export class FindServiceStageResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Waiting for service',
  })
  description: string;

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

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  static from({
    id,
    description,
    status,
    createdAt,
    updatedAt,
  }: ServiceStage): FindServiceStageResponseDto {
    return {
      id,
      description,
      status,
      createdAt,
      updatedAt,
    };
  }
}
