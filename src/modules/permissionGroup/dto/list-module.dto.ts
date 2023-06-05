import { ApiProperty } from '@nestjs/swagger';
import { Module } from '../../module/entity/module.entity';

export class ListModuleDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'USER',
  })
  description: string;

  static from({ id, description }: Module): ListModuleDto {
    return {
      id,
      description,
    };
  }
}
