import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateModuleResponse } from './dto/create-module-response.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleResponse } from './dto/update-module-response.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module as ModuleEntity } from './entity/module.entity';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(ModuleEntity)
    private readonly moduleRepository: Repository<ModuleEntity>,
  ) {}

  public async find(id: number): Promise<ModuleEntity> {
    return this.moduleRepository.findOne({
      where: { id },
      select: ['id', 'description', 'createdAt'],
    });
  }

  public async list(): Promise<ModuleEntity[]> {
    return this.moduleRepository.find({
      select: ['id', 'description'],
    });
  }

  public async create({
    description,
  }: CreateModuleDto): Promise<CreateModuleResponse> {
    const module = await this.moduleRepository.save({
      description,
    });

    return CreateModuleResponse.from(module);
  }

  public async update(
    id: number,
    { description }: UpdateModuleDto,
  ): Promise<UpdateModuleResponse> {
    await this.moduleRepository.update({ id }, { description });

    const module = await this.moduleRepository.findOne({
      where: { id },
      select: ['id', 'description', 'createdAt', 'updatedAt'],
    });

    return UpdateModuleResponse.from(module);
  }

  public async delete(id: number): Promise<boolean> {
    const { affected } = await this.moduleRepository.softDelete({ id });

    return affected > 0;
  }
}
