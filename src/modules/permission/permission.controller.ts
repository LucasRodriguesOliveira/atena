import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePermissionResponse } from './dto/create-permission-response.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionResponse } from './dto/update-permission-response.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionService } from './permission.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { ListPermissionDto } from './dto/list-permission.dto';
import { FindPermissionDto } from './dto/find-permission.dto';
import { AppModule } from '../auth/decorator/app-module.decorator';
import { AccessPermission } from '../auth/decorator/access-permission.decorator';

@Controller('permission')
@ApiTags('permission')
@AppModule('PERMISSION')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindPermissionDto,
  })
  @ApiNotFoundResponse()
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FindPermissionDto> {
    let permission: FindPermissionDto;

    try {
      permission = await this.permissionService.find(id);
    } catch (err) {
      throw new NotFoundException('Permission could not be found');
    }

    return permission;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListPermissionDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async list(): Promise<ListPermissionDto[]> {
    return this.permissionService.list();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreatePermissionResponse,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
  public async create(
    @Body(ValidationPipe) createPermissionDto: CreatePermissionDto,
  ): Promise<CreatePermissionResponse> {
    return this.permissionService.create(createPermissionDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdatePermissionResponse,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePermissionDto: UpdatePermissionDto,
  ): Promise<UpdatePermissionResponse> {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.permissionService.delete(id);
  }
}
