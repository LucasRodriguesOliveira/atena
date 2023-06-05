import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionGroupService } from './permission-group.service';
import { ListUserTypeDto } from './dto/list-user-type.dto';
import { ListModuleDto } from './dto/list-module.dto';
import { ListPermissionsDto } from './dto/list-permissions.dto';
import { QueryPermissionsDto } from './dto/query-permissions.dto';
import { FindPermissionGroupDto } from './dto/find-permission-group.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { UserRole } from '../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../user-type/type/user-type.enum';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';

@Controller('permission-group')
@ApiTags('permission-group')
export class PermissionGroupController {
  constructor(
    private readonly permissionGroupService: PermissionGroupService,
  ) {}

  @Get('all/user-types')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: [ListUserTypeDto],
    description: 'List of all User Types registered in Permission Group',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async listUserTypes(): Promise<ListUserTypeDto[]> {
    return this.permissionGroupService.listUserTypes();
  }

  @Get(':userTypeId/modules')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: [ListModuleDto],
    description:
      'List of all modules registered in Permission Group by a User Type',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async listModules(
    @Param('userTypeId', ValidationPipe) userTypeId: number,
  ): Promise<ListModuleDto[]> {
    return this.permissionGroupService.listModules(userTypeId);
  }

  @Get(':userTypeId/:moduleId/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: [ListPermissionsDto],
    description:
      'List of all permissions registered in Permission Group by User Type and Module',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async listPermissions(
    @Param(ValidationPipe) queryPermissionsDto: QueryPermissionsDto,
  ): Promise<ListPermissionsDto[]> {
    return this.permissionGroupService.listPermissions(queryPermissionsDto);
  }

  @Get(':permissionGroupId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindPermissionGroupDto,
    description: 'Permission Group',
  })
  @ApiNotFoundResponse({
    description: 'Permission Group could not be found',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async find(
    @Param('permissionGroupId', ValidationPipe) permissionGroupId: number,
  ): Promise<FindPermissionGroupDto> {
    const permissionGroup = await this.permissionGroupService.find(
      permissionGroupId,
    );

    if (!permissionGroup) {
      throw new HttpException(
        'Permission Group could not be found',
        HttpStatus.NOT_FOUND,
      );
    }

    return permissionGroup;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: FindPermissionGroupDto,
    description: 'Permission Group created',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async create(
    @Body(ValidationPipe) createPermissionGroupDto: CreatePermissionGroupDto,
  ): Promise<FindPermissionGroupDto> {
    return this.permissionGroupService.create(createPermissionGroupDto);
  }

  @Delete(':permissionGroupId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: Boolean,
    description: 'Confirmation if the Permission Group was excluded',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async delete(
    @Param('permissionGroupId', ValidationPipe) permissionGroupId: number,
  ): Promise<boolean> {
    return this.permissionGroupService.delete(permissionGroupId);
  }
}
