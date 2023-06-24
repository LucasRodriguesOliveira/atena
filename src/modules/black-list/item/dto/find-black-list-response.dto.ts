import { ApiProperty } from '@nestjs/swagger';
import { randomInt, randomUUID } from 'crypto';
import { Client } from '../../../client/entity/client.entity';
import { Reason } from '../../reason/entity/reason.entity';
import { BlackList } from '../entity/black-list.entity';

export class FindBlackListClientResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Arthur Mars',
  })
  name: string;

  static from({ id, name }: Client): FindBlackListClientResponseDto {
    return {
      id,
      name,
    };
  }
}

export class FindBlackListReasonResponseDto {
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

  static from({ id, title }: Reason): FindBlackListReasonResponseDto {
    return {
      id,
      title,
    };
  }
}

export class FindBlackListResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  @ApiProperty({
    type: FindBlackListClientResponseDto,
  })
  client: FindBlackListClientResponseDto;

  @ApiProperty({
    type: FindBlackListReasonResponseDto,
  })
  reason: FindBlackListReasonResponseDto;

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
    client,
    reason,
    createdAt,
    updatedAt,
  }: BlackList): FindBlackListResponseDto {
    return {
      id,
      client: FindBlackListClientResponseDto.from(client),
      reason: FindBlackListReasonResponseDto.from(reason),
      createdAt,
      updatedAt,
    };
  }
}
