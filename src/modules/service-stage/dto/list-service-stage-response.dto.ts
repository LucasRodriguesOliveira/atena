import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { ServiceStage } from '../entity/service-stage.entity';

export class ListServiceStageResponseDto {
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

  static map({
    id,
    description,
    status,
  }: ServiceStage): ListServiceStageResponseDto {
    return {
      id,
      description,
      status,
    };
  }

  static from(serviceStages: ServiceStage[]): ListServiceStageResponseDto[] {
    return serviceStages.map(ListServiceStageResponseDto.map);
  }
}
