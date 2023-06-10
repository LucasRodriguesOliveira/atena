import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Client } from '../../client/entity/client.entity';

export class FindClientResponseDto {
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

  static from({ id, name }: Client): FindClientResponseDto {
    return {
      id,
      name,
    };
  }
}
