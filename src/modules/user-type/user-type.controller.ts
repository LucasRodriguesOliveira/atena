import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { UserType } from './entity/user-type.entity';
import { UserTypeService } from './user-type.service';

@Controller('user-type')
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  @Get()
  public async list(): Promise<UserType[]> {
    return this.userTypeService.list();
  }

  @Post()
  public async create(
    @Body() createUserTypeDto: CreateUserTypeDto,
  ): Promise<UserType> {
    return this.userTypeService.create(createUserTypeDto);
  }

  @Put(':userTypeId')
  public async update(
    @Param('userTypeId') userTypeId: number,
    @Body() updateUserTypeDto: UpdateUserTypeDto,
  ): Promise<UserType> {
    return this.userTypeService.update(userTypeId, updateUserTypeDto);
  }

  @Delete(':userTypeId')
  public async delete(
    @Param('userTypeId') userTypeId: number,
  ): Promise<boolean> {
    return this.userTypeService.delete(userTypeId);
  }
}
