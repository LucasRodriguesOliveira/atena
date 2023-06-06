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
} from '@nestjs/common';
import { UserRole } from '../auth/decorator/user-type.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { UserTypeEnum } from './type/user-type.enum';
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

@Controller('user-type')
@ApiTags('user-type')
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  @Get()
  @UserRole(UserTypeEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: [ListUserTypeResponse],
    description: 'list of user types',
  })
  public async list(): Promise<ListUserTypeResponse[]> {
    return this.userTypeService.list();
  }

  @Post()
  @UserRole(UserTypeEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateUserTypeResponse,
  })
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body(ValidationPipe) createUserTypeDto: CreateUserTypeDto,
  ): Promise<CreateUserTypeResponse> {
    return this.userTypeService.create(createUserTypeDto);
  }

  @Put(':userTypeId')
  @UserRole(UserTypeEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateUserTypeResponse,
  })
  public async update(
    @Param('userTypeId', ValidationPipe) userTypeId: number,
    @Body(ValidationPipe) updateUserTypeDto: UpdateUserTypeDto,
  ): Promise<UpdateUserTypeResponse> {
    return this.userTypeService.update(userTypeId, updateUserTypeDto);
  }

  @Delete(':userTypeId')
  @UserRole(UserTypeEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
    description: 'confirmation of the exclusion of the user type',
  })
  public async delete(
    @Param('userTypeId', ValidationPipe) userTypeId: number,
  ): Promise<boolean> {
    return this.userTypeService.delete(userTypeId);
  }
}
