import { ApiProperty } from '@nestjs/swagger';
import { Module } from '../../module/entity/module.entity';

export class FindModuleDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Permission',
  })
  description: string;

  static from({ id, description }: Module): FindModuleDto {
    return {
      id,
      description,
    };
  }
}
