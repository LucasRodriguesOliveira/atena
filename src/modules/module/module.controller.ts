import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
  ValidationPipe,
  HttpException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateModuleResponse } from './dto/create-module-response.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleResponse } from './dto/update-module-response.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModuleService } from './module.service';
import { FindModuleDto } from './dto/find-module.dto';
import { ListModuleDto } from './dto/list-module.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { UserRole } from '../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../user-type/type/user-type.enum';

@Controller('module')
@ApiTags('module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindModuleDto,
    description: 'Module received',
  })
  @ApiNotFoundResponse({
    description: 'Module could not be found',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async find(
    @Param('id', ValidationPipe) id: number,
  ): Promise<FindModuleDto> {
    const module = await this.moduleService.find(id);

    if (!module) {
      throw new HttpException(
        'Module could not be found',
        HttpStatus.NOT_FOUND,
      );
    }

    return module;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: [ListModuleDto],
    description: 'A list of all modules',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async list(): Promise<ListModuleDto[]> {
    return this.moduleService.list();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateModuleResponse,
    description: 'Module created',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async create(
    @Body(ValidationPipe) createModuleDto: CreateModuleDto,
  ): Promise<CreateModuleResponse> {
    return this.moduleService.create(createModuleDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateModuleResponse,
    description: 'Module updated',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async update(
    @Param('id', ValidationPipe) id: number,
    @Body(ValidationPipe) updateModuleDto: UpdateModuleDto,
  ): Promise<UpdateModuleResponse> {
    return this.moduleService.update(id, updateModuleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
    description: 'Confirmation that the module has been removed',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async delete(
    @Param('id', ValidationPipe) id: number,
  ): Promise<boolean> {
    return this.moduleService.delete(id);
  }
}
