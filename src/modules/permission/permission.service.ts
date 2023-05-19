import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionResponse } from './dto/create-permission-response.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionResponse } from './dto/update-permission-response.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entity/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  public async find(id: number): Promise<Permission> {
    return this.permissionRepository.findOne({
      where: { id },
      select: ['id', 'description', 'createdAt'],
    });
  }

  public async list(): Promise<Permission[]> {
    return this.permissionRepository.find({
      select: ['id', 'description'],
    });
  }

  public async create({
    description,
  }: CreatePermissionDto): Promise<CreatePermissionResponse> {
    const permission = await this.permissionRepository.save({
      description,
    });

    return CreatePermissionResponse.from(permission);
  }

  public async update(
    id: number,
    { description }: UpdatePermissionDto,
  ): Promise<UpdatePermissionResponse> {
    await this.permissionRepository.update({ id }, { description });

    const permission = await this.permissionRepository.findOne({
      where: { id },
      select: ['id', 'description', 'createdAt', 'updatedAt'],
    });

    return UpdatePermissionResponse.from(permission);
  }

  public async delete(id: number): Promise<boolean> {
    const { affected } = await this.permissionRepository.softDelete({ id });

    return affected > 0;
  }
}
