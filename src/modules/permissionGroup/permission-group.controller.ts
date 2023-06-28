import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
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
import { FindPermissionGroupDto } from './dto/find-permission-group.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { AccessPermission } from '../auth/decorator/access-permission.decorator';
import { AppModule } from '../auth/decorator/app-module.decorator';

@Controller('permission-group')
@ApiTags('permission-group')
@AppModule('PERMISSION_GROUP')
export class PermissionGroupController {
  constructor(
    private readonly permissionGroupService: PermissionGroupService,
  ) {}

  @Get('all/user-types')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListUserTypeDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async listUserTypes(): Promise<ListUserTypeDto[]> {
    return this.permissionGroupService.listUserTypes();
  }

  @Get(':userTypeId/modules')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListModuleDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async listModules(
    @Param('userTypeId', ValidationPipe) userTypeId: number,
  ): Promise<ListModuleDto[]> {
    return this.permissionGroupService.listModules(userTypeId);
  }

  @Get(':userTypeId/:moduleId/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListPermissionsDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async listPermissions(
    @Param('userTypeId', ParseIntPipe) userTypeId: number,
    @Param('moduleId', ParseIntPipe) moduleId: number,
  ): Promise<ListPermissionsDto[]> {
    return this.permissionGroupService.listPermissions(moduleId, userTypeId);
  }

  @Get(':permissionGroupId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindPermissionGroupDto,
  })
  @ApiNotFoundResponse()
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('permissionGroupId', ParseIntPipe) permissionGroupId: number,
  ): Promise<FindPermissionGroupDto> {
    let permissionGroup: FindPermissionGroupDto;

    try {
      permissionGroup = await this.permissionGroupService.find(
        permissionGroupId,
      );
    } catch (err) {
      throw new NotFoundException('Permission Group could not be found');
    }

    return permissionGroup;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: FindPermissionGroupDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
  public async create(
    @Body(ValidationPipe) createPermissionGroupDto: CreatePermissionGroupDto,
  ): Promise<FindPermissionGroupDto> {
    return this.permissionGroupService.create(createPermissionGroupDto);
  }

  @Delete(':permissionGroupId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('permissionGroupId', ParseIntPipe) permissionGroupId: number,
  ): Promise<boolean> {
    return this.permissionGroupService.delete(permissionGroupId);
  }
}
