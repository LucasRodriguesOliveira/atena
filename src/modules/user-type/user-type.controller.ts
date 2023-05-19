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
import { ApiTags } from '@nestjs/swagger';

@Controller('user-type')
@ApiTags('user-type')
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  @Get()
  @UserRole(UserTypeEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  public async list(): Promise<ListUserTypeResponse[]> {
    return this.userTypeService.list();
  }

  @Post()
  @UserRole(UserTypeEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  public async create(
    @Body(ValidationPipe) createUserTypeDto: CreateUserTypeDto,
  ): Promise<CreateUserTypeResponse> {
    const userType = await this.userTypeService.create(createUserTypeDto);

    return CreateUserTypeResponse.from(userType);
  }

  @Put(':userTypeId')
  @UserRole(UserTypeEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  public async update(
    @Param('userTypeId') userTypeId: number,
    @Body(ValidationPipe) updateUserTypeDto: UpdateUserTypeDto,
  ): Promise<UpdateUserTypeResponse> {
    const userType = await this.userTypeService.update(
      userTypeId,
      updateUserTypeDto,
    );

    return UpdateUserTypeResponse.from(userType);
  }

  @Delete(':userTypeId')
  @UserRole(UserTypeEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  public async delete(
    @Param('userTypeId') userTypeId: number,
  ): Promise<boolean> {
    return this.userTypeService.delete(userTypeId);
  }
}
