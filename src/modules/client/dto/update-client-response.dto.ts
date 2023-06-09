import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Client } from '../entity/client.entity';

export class UpdateClientResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Steve Castle',
  })
  name: string;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  static from({ id, name, updatedAt }: Client): UpdateClientResponseDto {
    return {
      id,
      name,
      updatedAt,
    };
  }
}
