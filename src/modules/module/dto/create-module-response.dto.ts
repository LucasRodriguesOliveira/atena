import { ApiProperty } from '@nestjs/swagger';
import { Module as ModuleEntity } from '../entity/module.entity';

export class CreateModuleResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  static from({ id, description }: ModuleEntity): CreateModuleResponse {
    return {
      id,
      description,
    };
  }
}
