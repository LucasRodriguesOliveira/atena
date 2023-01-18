import {
  Controller,
  Get,
  Query,
  ValidationPipe,
  Param,
  Put,
  Body,
  Delete,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async list(
    @Query('name', ValidationPipe) name: string,
    @Query('username', ValidationPipe) username: string,
  ): Promise<User[]> {
    return this.userService.list({
      name,
      username,
    });
  }

  @Get(':userId')
  public async find(@Param('userId') userId: string): Promise<User> {
    return this.userService.find(userId);
  }

  @Put(':userId')
  public async update(
    @Param('userId') userId: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  public async delete(@Param('userId') userId: string): Promise<boolean> {
    return this.userService.delete(userId);
  }
}
