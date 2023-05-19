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
import { CreatePermissionResponse } from './dto/create-permission-response.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionResponse } from './dto/update-permission-response.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entity/permission.entity';
import { PermissionService } from './permission.service';

@Controller('permission')
@ApiTags('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get(':id')
  public async find(@Param('id') id: number): Promise<Permission> {
    return this.permissionService.find(id);
  }

  @Get()
  public async list(): Promise<Permission[]> {
    return this.permissionService.list();
  }

  @Post()
  public async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<CreatePermissionResponse> {
    return this.permissionService.create(createPermissionDto);
  }

  @Put(':id')
  public async update(
    @Param('id') id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<UpdatePermissionResponse> {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  public async delete(@Param('id') id: number): Promise<boolean> {
    return this.permissionService.delete(id);
  }
}
