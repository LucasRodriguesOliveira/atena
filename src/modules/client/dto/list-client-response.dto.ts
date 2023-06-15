import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Client } from '../entity/client.entity';
import { PaginatedResult } from '../../../shared/paginated-result.interface';

export class ListClientResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'John Doe',
  })
  name: string;

  static map({ id, name }: Client): ListClientResponseDto {
    return {
      id,
      name,
    };
  }

  static from(
    clients: Client[],
    total: number,
  ): PaginatedResult<ListClientResponseDto> {
    return {
      data: clients.map(ListClientResponseDto.map),
      total,
    };
  }
}
