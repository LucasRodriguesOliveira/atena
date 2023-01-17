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
import { UserType } from './entity/user-type.entity';
import { UserTypeEnum } from './type/user-type.enum';
import { UserTypeService } from './user-type.service';

@Controller('user-type')
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  @Get()
  @UserRole(UserTypeEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  public async list(): Promise<UserType[]> {
    return this.userTypeService.list();
  }

  @Post()
  @UserRole(UserTypeEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  public async create(
    @Body(ValidationPipe) createUserTypeDto: CreateUserTypeDto,
  ): Promise<UserType> {
    return this.userTypeService.create(createUserTypeDto);
  }

  @Put(':userTypeId')
  @UserRole(UserTypeEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  public async update(
    @Param('userTypeId') userTypeId: number,
    @Body(ValidationPipe) updateUserTypeDto: UpdateUserTypeDto,
  ): Promise<UserType> {
    return this.userTypeService.update(userTypeId, updateUserTypeDto);
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
