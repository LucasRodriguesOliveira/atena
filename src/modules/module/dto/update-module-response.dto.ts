import { ApiProperty } from '@nestjs/swagger';
import { Module as ModuleEntity } from '../entity/module.entity';

export class UpdateModuleResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
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
