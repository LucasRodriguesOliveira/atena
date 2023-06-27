import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ValidationPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { UserTypeService } from './user-type.service';
import { CreateUserTypeResponse } from './dto/create-user-type-response.dto';
import { ListUserTypeResponse } from './dto/list-user-type-response.dto';
import { UpdateUserTypeResponse } from './dto/update-user-type-response.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppModule } from '../auth/decorator/app-module.decorator';
import { AccessPermission } from '../auth/decorator/access-permission.decorator';

@Controller('user-type')
@ApiTags('user-type')
@AppModule('USER_TYPE')
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  @Get()
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListUserTypeResponse,
    isArray: true,
  })
  @AccessPermission('LIST')
  public async list(): Promise<ListUserTypeResponse[]> {
    return this.userTypeService.list();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateUserTypeResponse,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
  public async create(
    @Body(ValidationPipe) createUserTypeDto: CreateUserTypeDto,
  ): Promise<CreateUserTypeResponse> {
    return this.userTypeService.create(createUserTypeDto);
  }

  @Put(':userTypeId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateUserTypeResponse,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('userTypeId', ParseIntPipe) userTypeId: number,
    @Body(ValidationPipe) updateUserTypeDto: UpdateUserTypeDto,
  ): Promise<UpdateUserTypeResponse> {
    return this.userTypeService.update(userTypeId, updateUserTypeDto);
  }

  @Delete(':userTypeId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('userTypeId', ParseIntPipe) userTypeId: number,
  ): Promise<boolean> {
    return this.userTypeService.delete(userTypeId);
  }
}
