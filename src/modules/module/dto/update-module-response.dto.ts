import { ApiProperty } from '@nestjs/swagger';
import { Module as ModuleEntity } from '../entity/module.entity';

export class UpdateModuleResponse {
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

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  static from({
    id,
    description,
    createdAt,
    updatedAt,
  }: ModuleEntity): UpdateModuleResponse {
    return {
      id,
      description,
      createdAt,
      updatedAt,
    };
  }
}
