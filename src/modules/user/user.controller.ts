import {
  Controller,
  Get,
  Query,
  ValidationPipe,
  Param,
  Put,
  Body,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { UserRole } from '../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../user-type/type/user-type.enum';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async list(
    @Query('name', ValidationPipe) name?: string,
    @Query('username', ValidationPipe) username?: string,
  ): Promise<User[]> {
    return this.userService.list({
      name,
      username,
    });
  }

  @Get(':userId')
  @UseGuards(JwtGuard)
  public async find(@Param('userId') userId: string): Promise<User> {
    return this.userService.find(userId);
  }

  @Put(':userId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('userId') userId: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  @UserRole(UserTypeEnum.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  public async delete(@Param('userId') userId: string): Promise<boolean> {
    return this.userService.delete(userId);
  }
}
