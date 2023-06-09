import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Client } from '../entity/client.entity';

export class CreateClientResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'John',
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

  static from({ id, name, email, createdAt }: Client): CreateClientResponseDto {
    return {
      id,
      name,
      email,
      createdAt,
    };
  }
}
