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
  NotFoundException,
  ParseIntPipe,
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
import { AppModule } from '../auth/decorator/app-module.decorator';
import { AccessPermission } from '../auth/decorator/access-permission.decorator';

@Controller('module')
@ApiTags('module')
@AppModule('MODULE')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindModuleDto,
  })
  @ApiNotFoundResponse()
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FindModuleDto> {
    let module: FindModuleDto;

    try {
      module = await this.moduleService.find(id);
    } catch (err) {
      throw new NotFoundException('Module could not be found');
    }

    return module;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListModuleDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async list(): Promise<ListModuleDto[]> {
    return this.moduleService.list();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateModuleResponse,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
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
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateModuleDto: UpdateModuleDto,
  ): Promise<UpdateModuleResponse> {
    return this.moduleService.update(id, updateModuleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.moduleService.delete(id);
  }
}
