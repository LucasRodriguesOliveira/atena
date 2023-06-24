import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResult } from '../../../../shared/paginated-result.interface';
import { BlackList } from '../entity/black-list.entity';
import { randomInt, randomUUID } from 'crypto';
import { Client } from '../../../client/entity/client.entity';
import { Reason } from '../../reason/entity/reason.entity';

export class ListBlackListClientResponseDto {
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

  static from({ id, name }: Client): ListBlackListClientResponseDto {
    return {
      id,
      name,
    };
  }
}

export class ListBlackListReasonResponseDto {
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

  static from({ id, title }: Reason): ListBlackListReasonResponseDto {
    return {
      id,
      title,
    };
  }
}

export class ListItemBlackListResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  @ApiProperty({
    type: ListBlackListClientResponseDto,
  })
  client: ListBlackListClientResponseDto;

  @ApiProperty({
    type: ListBlackListReasonResponseDto,
  })
  reason: ListBlackListReasonResponseDto;

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
  }: BlackList): ListItemBlackListResponseDto {
    return {
      id,
      client,
      reason,
      createdAt,
    };
  }
}

export class ListBlackListResponseDto
  implements PaginatedResult<ListItemBlackListResponseDto>
{
  @ApiProperty({
    type: ListItemBlackListResponseDto,
  })
  data: ListItemBlackListResponseDto[];

  @ApiProperty({
    type: Number,
  })
  total: number;

  static from(blackList: BlackList[], total: number): ListBlackListResponseDto {
    return {
      data: blackList.map(ListItemBlackListResponseDto.from),
      total,
    };
  }
}
