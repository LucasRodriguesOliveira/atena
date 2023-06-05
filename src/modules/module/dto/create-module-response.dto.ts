import { ApiProperty } from '@nestjs/swagger';
import { Module as ModuleEntity } from '../entity/module.entity';

export class CreateModuleResponse {
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

  static from({ id, description }: ModuleEntity): CreateModuleResponse {
    return {
      id,
      description,
    };
  }
}
