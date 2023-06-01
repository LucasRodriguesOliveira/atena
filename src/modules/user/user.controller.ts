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
  HttpException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { UserRole } from '../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../user-type/type/user-type.enum';
import { FindUserDto } from './dto/find-user.dto';

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
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    type: FindUserDto,
    status: HttpStatus.OK,
    description: 'Expected User to receive',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: HttpException,
    description: 'User could not be found',
  })
  public async find(@Param('userId') userId: string): Promise<FindUserDto> {
    const user = await this.userService.find(userId);

    if (!user?.id) {
      throw new HttpException('User could not be found', HttpStatus.NOT_FOUND);
    }

    return user;
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
