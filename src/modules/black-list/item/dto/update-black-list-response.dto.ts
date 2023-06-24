import { ApiProperty } from '@nestjs/swagger';
import { randomInt, randomUUID } from 'crypto';
import { Client } from '../../../client/entity/client.entity';
import { Reason } from '../../reason/entity/reason.entity';
import { BlackList } from '../entity/black-list.entity';

export class UpdateBlackListClientResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'John Stuart',
  })
  name: string;

  static from({ id, name }: Client): UpdateBlackListClientResponseDto {
    return {
      id,
      name,
    };
  }
}

export class UpdateBlackListReasonResponseDto {
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

  static from({ id, title }: Reason): UpdateBlackListReasonResponseDto {
    return {
      id,
      title,
    };
  }
}

export class UpdateBlackListResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  @ApiProperty({
    type: UpdateBlackListClientResponseDto,
  })
  client: UpdateBlackListClientResponseDto;

  @ApiProperty({
    type: UpdateBlackListReasonResponseDto,
  })
  reason: UpdateBlackListReasonResponseDto;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  static from({
    id,
    client,
    reason,
    createdAt,
  }: BlackList): UpdateBlackListResponseDto {
    return {
      id,
      client,
      reason,
      createdAt,
    };
  }
}
