import { ApiProperty } from '@nestjs/swagger';
import { randomInt, randomUUID } from 'crypto';
import { Client } from '../../../client/entity/client.entity';
import { Reason } from '../../reason/entity/reason.entity';
import { BlackList } from '../entity/black-list.entity';

export class CreateBlackListClientResponseDto {
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

  static from({ id, name }: Client): CreateBlackListClientResponseDto {
    return {
      id,
      name,
    };
  }
}

export class CreateBlackListReasonResponseDto {
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

  static from({ id, title }: Reason): CreateBlackListReasonResponseDto {
    return {
      id,
      title,
    };
  }
}

export class CreateBlackListResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  @ApiProperty({
    type: CreateBlackListClientResponseDto,
  })
  client: CreateBlackListClientResponseDto;

  @ApiProperty({
    type: CreateBlackListReasonResponseDto,
  })
  reason: CreateBlackListReasonResponseDto;

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
  }: BlackList): CreateBlackListResponseDto {
    return {
      id,
      client,
      reason,
      createdAt,
    };
  }
}
