import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { ServicePack } from '../entity/service-pack.entity';

export class FindServicePackResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Basic',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: '',
  })
  description: string;

  @ApiProperty({
    type: String,
    example: '',
  })
  duration: number;

  @ApiProperty({
    type: String,
    example: '',
  })
  status: boolean;

  @ApiProperty({
    type: String,
    example: '',
  })
  createdAt: Date;

  static from({
    id,
    name,
    description,
    duration,
    status,
    createdAt,
  }: ServicePack): FindServicePackResponseDto {
    return {
      id,
      name,
      description,
      duration,
      status,
      createdAt,
    };
  }
}
