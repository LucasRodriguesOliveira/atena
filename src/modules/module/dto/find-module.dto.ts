import { ApiProperty } from '@nestjs/swagger';
import { Module } from '../entity/module.entity';

export class FindModuleDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Contract',
    examples: ['Contract', 'User', 'Permission'],
  })
  description: string;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  static from({ id, description, createdAt }: Module): FindModuleDto {
    return {
      id,
      description,
      createdAt,
    };
  }
}
