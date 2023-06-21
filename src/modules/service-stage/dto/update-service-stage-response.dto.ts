import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { ServiceStage } from '../entity/service-stage.entity';

export class UpdateServiceStageResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'New Description',
  })
  description: string;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  status: boolean;

  static from({
    id,
    description,
    status,
  }: ServiceStage): UpdateServiceStageResponseDto {
    return {
      id,
      description,
      status,
    };
  }
}
