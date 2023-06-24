import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { Reason } from '../entity/reason.entity';

export class CreateReasonResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Embezzlement',
  })
  title: string;

  static from({ id, title }: Reason): CreateReasonResponseDto {
    return {
      id,
      title,
    };
  }
}
