import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateModuleResponse } from './dto/create-module-response.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleResponse } from './dto/update-module-response.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module as ModuleEntity } from './entity/module.entity';
import { ListModuleDto } from './dto/list-module.dto';
import { FindModuleDto } from './dto/find-module.dto';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(ModuleEntity)
    private readonly moduleRepository: Repository<ModuleEntity>,
  ) {}

  public async find(id: number): Promise<FindModuleDto | null> {
    const module = await this.moduleRepository.findOne({
      where: { id },
      select: ['id', 'description', 'createdAt'],
    });

    if (!module?.id) {
      return null;
    }

    return FindModuleDto.from(module);
  }

  public async list(): Promise<ListModuleDto[]> {
    const moduleList = await this.moduleRepository.find({
      select: ['id', 'description'],
    });

    return moduleList.map((module) => ListModuleDto.from(module));
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
