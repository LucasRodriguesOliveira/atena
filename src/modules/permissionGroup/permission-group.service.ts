import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionGroup } from './entity/permission-group.entity';
import { Repository } from 'typeorm';
import { FindPermissionGroupDto } from './dto/find-permission-group.dto';
import { UserType } from '../user-type/entity/user-type.entity';
import { ListUserTypeDto } from './dto/list-user-type.dto';
import { ListModuleDto } from './dto/list-module.dto';
import { Module } from '../module/entity/module.entity';
import { ListPermissionsDto } from './dto/list-permissions.dto';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';

@Injectable()
export class PermissionGroupService {
  constructor(
    @InjectRepository(PermissionGroup)
    private readonly permissionGroupRepository: Repository<PermissionGroup>,
  ) {}

  async find(
    permissionGroupId: number,
  ): Promise<FindPermissionGroupDto | null> {
    const permissionGroup = await this.permissionGroupRepository.findOneOrFail({
      where: {
        id: permissionGroupId,
      },
      select: {
        id: true,
        userType: {
          id: true,
          description: true,
        },
        permission: {
          id: true,
          description: true,
        },
        module: {
          id: true,
          description: true,
        },
      },
      relations: {
        userType: true,
        permission: true,
        module: true,
      },
    });

    if (!permissionGroup?.id) {
      return null;
    }

    return FindPermissionGroupDto.from(permissionGroup);
  }

  async listUserTypes(): Promise<ListUserTypeDto[]> {
    const result: UserType[] = await this.permissionGroupRepository
      .createQueryBuilder('permissionGroup')
      .select('userType.id as "id"')
      .addSelect('userType.description as "description"')
      .leftJoin(
        UserType,
        'userType',
        'userType.id = permissionGroup.userTypeId',
      )
      .groupBy('userType.id')
      .addGroupBy('userType.description')
      .getRawMany();

    return result.map((userType) => ListUserTypeDto.from(userType));
  }

  async listModules(userTypeId: number): Promise<ListModuleDto[]> {
    const result: Module[] = await this.permissionGroupRepository
      .createQueryBuilder('permissionGroup')
      .select('module.id as "id"')
      .addSelect('module.description as "description"')
      .leftJoin(Module, 'module', 'module.id = permissionGroup.moduleId')
      .where('permissionGroup.userTypeId = :userTypeId', { userTypeId })
      .groupBy('module.id')
      .addGroupBy('module.description')
      .getRawMany();

    return result.map((module) => ListModuleDto.from(module));
  }

  async listPermissions(
    moduleId: number,
    userTypeId: number,
  ): Promise<ListPermissionsDto[]> {
    const result = await this.permissionGroupRepository.find({
      select: {
        id: true,
        permission: {
          id: true,
          description: true,
        },
      },
      relations: {
        permission: true,
      },
      where: {
        userType: {
          id: userTypeId,
        },
        module: {
          id: moduleId,
        },
      },
    });

    return result.map((permissionGroup) =>
      ListPermissionsDto.from(permissionGroup),
    );
  }

  async create({
    userTypeId,
    moduleId,
    permissionId,
  }: CreatePermissionGroupDto): Promise<FindPermissionGroupDto> {
    const permissionGroup = await this.permissionGroupRepository.save({
      userType: {
        id: userTypeId,
      },
      module: {
        id: moduleId,
      },
      permission: {
        id: permissionId,
      },
    });

    return FindPermissionGroupDto.from(permissionGroup);
  }

  async delete(permissionGroupId: number): Promise<boolean> {
    const { affected } = await this.permissionGroupRepository.delete({
      id: permissionGroupId,
    });

    return affected > 0;
  }
}
