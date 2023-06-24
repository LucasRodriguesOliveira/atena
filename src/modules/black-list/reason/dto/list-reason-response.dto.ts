import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { Reason } from '../entity/reason.entity';

export class ListReasonResponseDto {
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

  static map({ id, title }: Reason): ListReasonResponseDto {
    return {
      id,
      title,
    };
  }

  static from(reasons: Reason[]): ListReasonResponseDto[] {
    return reasons.map(ListReasonResponseDto.map);
  }
}
