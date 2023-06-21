import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';

export class CreateServiceStageResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Not interested',
  })
  description: string;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  status: boolean;

  static from({ id, description, status }): CreateServiceStageResponseDto {
    return {
      id,
      description,
      status,
    };
  }
}
