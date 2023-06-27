import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  ValidationPipe,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ServicePackItemTypeService } from './service-pack-item-type.service';
import { ListServicePackItemTypeResponseDto } from './dto/list-service-pack-item-type-response.dto';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { RoleGuard } from '../../auth/guard/role.guard';
import { QueryServicePackItemTypeDto } from './dto/query-service-pack-item-type.dto';
import { CreateServicePackItemTypeResponseDto } from './dto/create-service-pack-item-type-response.dto';
import { CreateServicePackItemTypeDto } from './dto/create-service-pack-item-type.dto';
import { FindServicePackItemTypeResponseDto } from './dto/find-service-pack-item-type-response.dto';
import { UpdateServicePackItemTypeResponseDto } from './dto/update-service-pack-item-type-response.dto';
import { UpdateServicePackItemTypeDto } from './dto/update-service-pack-item-type.dto';
import { AppModule } from '../../auth/decorator/app-module.decorator';
import { AccessPermission } from '../../auth/decorator/access-permission.decorator';

@Controller('service-pack/item-type')
@ApiTags('service-pack')
@AppModule('SERVICE_PACK_TYPE')
export class ServicePackItemTypeController {
  constructor(
    private readonly servicePackItemTypeService: ServicePackItemTypeService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListServicePackItemTypeResponseDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async list(
    @Query(ValidationPipe)
    queryServicePackItemType: QueryServicePackItemTypeDto,
  ): Promise<ListServicePackItemTypeResponseDto[]> {
    return this.servicePackItemTypeService.list(queryServicePackItemType);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateServicePackItemTypeResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
  public async create(
    @Body(ValidationPipe)
    createServicePackItemTypeDto: CreateServicePackItemTypeDto,
  ): Promise<CreateServicePackItemTypeResponseDto> {
    return this.servicePackItemTypeService.create(createServicePackItemTypeDto);
  }

  @Get(':servicePackItemTypeId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindServicePackItemTypeResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('servicePackItemTypeId', ParseIntPipe)
    servicePackItemTypeId: number,
  ): Promise<FindServicePackItemTypeResponseDto> {
    let servicePackItemType: FindServicePackItemTypeResponseDto;

    try {
      servicePackItemType = await this.servicePackItemTypeService.find(
        servicePackItemTypeId,
      );
    } catch (err) {
      throw new NotFoundException(
        'could not find the type of the item of the service pack',
      );
    }

    return servicePackItemType;
  }

  @Put(':servicePackItemTypeId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateServicePackItemTypeResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('servicePackItemTypeId', ParseIntPipe)
    servicePackItemTypeId: number,
    @Body(ValidationPipe)
    updateServicePackItemType: UpdateServicePackItemTypeDto,
  ): Promise<UpdateServicePackItemTypeResponseDto> {
    return this.servicePackItemTypeService.update(
      servicePackItemTypeId,
      updateServicePackItemType,
    );
  }

  @Delete(':servicePackItemTypeId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('servicePackItemTypeId', ParseIntPipe) servicePackItemTypeId: number,
  ): Promise<boolean> {
    return this.servicePackItemTypeService.delete(servicePackItemTypeId);
  }
}
