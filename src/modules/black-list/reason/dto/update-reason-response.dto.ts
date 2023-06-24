import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { Reason } from '../entity/reason.entity';

export class UpdateReasonResponseDto {
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

  @ApiProperty({
    type: String,
    example: 'Tried to confuse the sales team to pay nothing for the services.',
  })
  details: string;

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
    title,
    details,
    createdAt,
    updatedAt,
  }: Reason): UpdateReasonResponseDto {
    return {
      id,
      title,
      details,
      createdAt,
      updatedAt,
    };
  }
}
