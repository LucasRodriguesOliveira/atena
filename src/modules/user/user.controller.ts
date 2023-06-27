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
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import { ListUserResponseDto } from './dto/list-user-response.dto';
import { AppModule } from '../auth/decorator/app-module.decorator';
import { AccessPermission } from '../auth/decorator/access-permission.decorator';

@Controller('user')
@ApiTags('user')
@AppModule('USER')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListUserResponseDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async list(
    @Query('name', ValidationPipe) name?: string,
    @Query('username', ValidationPipe) username?: string,
  ): Promise<ListUserResponseDto[]> {
    return this.userService.list({
      name,
      username,
    });
  }

  @Get(':userId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindUserDto,
  })
  @ApiNotFoundResponse()
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<FindUserDto> {
    let user: FindUserDto;

    try {
      user = await this.userService.find(userId);
    } catch (err) {
      throw new NotFoundException('User could not be found');
    }

    return user;
  }

  @Put(':userId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateUserResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<boolean> {
    return this.userService.delete(userId);
  }
}
