import { ApiProperty } from '@nestjs/swagger';
import { Module } from '../entity/module.entity';

export class ListModuleDto {
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

  static from({ id, description }: Module): ListModuleDto {
    return {
      id,
      description,
    };
  }
}
