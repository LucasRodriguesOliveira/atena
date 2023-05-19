import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateModuleResponse } from './dto/create-module-response.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleResponse } from './dto/update-module-response.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module as ModuleEntity } from './entity/module.entity';
import { ModuleService } from './module.service';

@Controller('module')
@ApiTags('module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Get(':id')
  public async find(@Param('id') id: number): Promise<ModuleEntity> {
    return this.moduleService.find(id);
  }

  @Get()
  public async list(): Promise<ModuleEntity[]> {
    return this.moduleService.list();
  }

  @Post()
  public async create(
    @Body() createModuleDto: CreateModuleDto,
  ): Promise<CreateModuleResponse> {
    return this.moduleService.create(createModuleDto);
  }

  @Put(':id')
  public async update(
    @Param('id') id: number,
    @Body() updateModuleDto: UpdateModuleDto,
  ): Promise<UpdateModuleResponse> {
    return this.moduleService.update(id, updateModuleDto);
  }

  @Delete(':id')
  public async delete(@Param('id') id: number): Promise<boolean> {
    return this.moduleService.delete(id);
  }
}
