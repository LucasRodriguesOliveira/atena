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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ServicePackItemTypeService } from './service-pack-item-type.service';
import { ListServicePackItemTypeResponseDto } from './dto/list-service-pack-item-type-response.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { UserRole } from '../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../user-type/type/user-type.enum';
import { QueryServicePackItemTypeDto } from './dto/query-service-pack-item-type.dto';
import { CreateServicePackItemTypeResponseDto } from './dto/create-service-pack-item-type-response.dto';
import { CreateServicePackItemTypeDto } from './dto/create-service-pack-item-type.dto';
import { FindServicePackItemTypeResponseDto } from './dto/find-service-pack-item-type-response.dto';
import { UpdateServicePackItemTypeResponseDto } from './dto/update-service-pack-item-type-response.dto';
import { UpdateServicePackItemTypeDto } from './dto/update-service-pack-item-type.dto';

@Controller('service-pack/item-type')
@ApiTags('service-pack')
export class ServicePackItemTypeController {
  constructor(
    private readonly servicePackItemTypeService: ServicePackItemTypeService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: [ListServicePackItemTypeResponseDto],
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
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
  @UserRole(UserTypeEnum.ADMIN)
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
  @UserRole(UserTypeEnum.ADMIN)
  public async find(
    @Param('servicePackItemTypeId', ValidationPipe)
    servicePackItemTypeId: number,
  ): Promise<FindServicePackItemTypeResponseDto> {
    return this.servicePackItemTypeService.find(servicePackItemTypeId);
  }

  @Put(':servicePackItemTypeId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateServicePackItemTypeResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async update(
    @Param('servicePackItemTypeId', ValidationPipe)
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
  @UserRole(UserTypeEnum.ADMIN)
  public async delete(
    @Param('servicePackItemTypeId') servicePackItemTypeId: number,
  ): Promise<boolean> {
    return this.servicePackItemTypeService.delete(servicePackItemTypeId);
  }
}
