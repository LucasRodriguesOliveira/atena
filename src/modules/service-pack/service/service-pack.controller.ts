import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ServicePackService } from './service-pack.service';
import { ListServicePackResponseDto } from './dto/list-service-pack-response.dto';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { RoleGuard } from '../../auth/guard/role.guard';
import { QueryListServicePackDto } from './dto/query-list-service-pack.dto';
import { CreateServicePackResponseDto } from './dto/create-service-pack-response.dto';
import { CreateServicePackDto } from './dto/create-service-pack.dto';
import { FindServicePackResponseDto } from './dto/find-service-pack-response.dto';
import { UpdateServicePackDto } from './dto/update-service-pack.dto';
import { UpdateServicePackResponseDto } from './dto/update-service-pack-response.dto';
import { AppModule } from '../../auth/decorator/app-module.decorator';
import { AccessPermission } from '../../auth/decorator/access-permission.decorator';

@Controller('service-pack/service')
@ApiTags('service-pack')
@AppModule('SERVICE_PACK')
export class ServicePackController {
  constructor(private readonly servicePackService: ServicePackService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListServicePackResponseDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async list(
    @Query(ValidationPipe) queryListServicePackDto: QueryListServicePackDto,
  ): Promise<ListServicePackResponseDto[]> {
    return this.servicePackService.list(queryListServicePackDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateServicePackResponseDto,
  })
  @ApiBody({
    type: CreateServicePackDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
  public async create(
    @Body(ValidationPipe) createServicePackDto: CreateServicePackDto,
  ): Promise<CreateServicePackResponseDto> {
    return this.servicePackService.create(createServicePackDto);
  }

  @Get(':servicePackId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindServicePackResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('servicePackId', ParseUUIDPipe) servicePackId: string,
  ): Promise<FindServicePackResponseDto> {
    let servicePack: FindServicePackResponseDto;

    try {
      servicePack = await this.servicePackService.find(servicePackId);
    } catch (err) {
      throw new NotFoundException('could not find the Service Pack');
    }

    return servicePack;
  }

  @Put(':servicePackId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateServicePackResponseDto,
  })
  @ApiBody({
    type: UpdateServicePackDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('servicePackId', ParseUUIDPipe) servicePackId: string,
    @Body(ValidationPipe) updateServicePackDto: UpdateServicePackDto,
  ): Promise<UpdateServicePackResponseDto> {
    return this.servicePackService.update(servicePackId, updateServicePackDto);
  }

  @Delete(':servicePackId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('servicePackId', ParseUUIDPipe) servicePackId: string,
  ): Promise<boolean> {
    return this.servicePackService.delete(servicePackId);
  }
}
