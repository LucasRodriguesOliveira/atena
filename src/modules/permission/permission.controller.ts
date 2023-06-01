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
  HttpException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePermissionResponse } from './dto/create-permission-response.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionResponse } from './dto/update-permission-response.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionService } from './permission.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { UserRole } from '../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../user-type/type/user-type.enum';
import { ListPermissionDto } from './dto/list-permission.dto';
import { FindPermissionDto } from './dto/find-permission.dto';

@Controller('permission')
@ApiTags('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permission',
    type: FindPermissionDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Permission could not be found',
  })
  public async find(@Param('id') id: number): Promise<FindPermissionDto> {
    const permission = await this.permissionService.find(id);

    if (!permission?.id) {
      throw new HttpException(
        'Permission could not be found',
        HttpStatus.NOT_FOUND,
      );
    }

    return permission;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ListPermissionDto],
    description: 'A list of all the permissions',
  })
  public async list(): Promise<ListPermissionDto[]> {
    return this.permissionService.list();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  public async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<CreatePermissionResponse> {
    return this.permissionService.create(createPermissionDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  public async update(
    @Param('id') id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<UpdatePermissionResponse> {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  public async delete(@Param('id') id: number): Promise<boolean> {
    return this.permissionService.delete(id);
  }
}
