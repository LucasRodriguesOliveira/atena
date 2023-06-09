import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Client } from '../entity/client.entity';

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

  @ApiProperty({
    type: String,
    example: 'johndoe.contact@cpny.com',
  })
  email: string;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  static from({ id, name, email, createdAt }: Client): FindClientResponseDto {
    return {
      id,
      name,
      email,
      createdAt,
    };
  }
}
