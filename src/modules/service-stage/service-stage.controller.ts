import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ServiceStageService } from './service-stage.service';
import { ListServiceStageResponseDto } from './dto/list-service-stage-response.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { QueryServiceStageDto } from './dto/query-service-stage.dto';
import { CreateServiceStageResponseDto } from './dto/create-service-stage-response.dto';
import { CreateServiceStageDto } from './dto/create-service-stage.dto';
import { FindServiceStageResponseDto } from './dto/find-service-stage-response.dto';
import { UpdateServiceStageResponseDto } from './dto/update-service-stage-response.dto';
import { UpdateServiceStageDto } from './dto/update-service-stage.dto';
import { AppModule } from '../auth/decorator/app-module.decorator';
import { AccessPermission } from '../auth/decorator/access-permission.decorator';

@Controller('service-stage')
@ApiTags('service-stage')
@AppModule('SERVICE_STAGE')
export class ServiceStageController {
  constructor(private readonly serviceStageService: ServiceStageService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListServiceStageResponseDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async list(
    @Query(ValidationPipe) queryServiceStageDto: QueryServiceStageDto,
  ): Promise<ListServiceStageResponseDto[]> {
    return this.serviceStageService.list(queryServiceStageDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateServiceStageResponseDto,
  })
  @ApiBody({
    type: CreateServiceStageDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
  public async create(
    @Body(ValidationPipe) createServiceStageDto: CreateServiceStageDto,
  ): Promise<CreateServiceStageResponseDto> {
    return this.serviceStageService.create(createServiceStageDto);
  }

  @Get(':serviceStageId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindServiceStageResponseDto,
  })
  @ApiNotFoundResponse()
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('serviceStageId', ParseIntPipe) serviceStageId: number,
  ): Promise<FindServiceStageResponseDto> {
    let serviceStage: FindServiceStageResponseDto;

    try {
      serviceStage = await this.serviceStageService.find(serviceStageId);
    } catch (err) {
      throw new NotFoundException('could not find the service stage');
    }

    return serviceStage;
  }

  @Put(':serviceStageId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateServiceStageResponseDto,
  })
  @ApiBody({
    type: UpdateServiceStageDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('serviceStageId', ValidationPipe) serviceStageId: number,
    @Body(ValidationPipe) updateServiceStageDto: UpdateServiceStageDto,
  ): Promise<UpdateServiceStageResponseDto> {
    return this.serviceStageService.update(
      serviceStageId,
      updateServiceStageDto,
    );
  }

  @Delete(':serviceStageId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('serviceStageId', ValidationPipe) serviceStageId: number,
  ): Promise<boolean> {
    return this.serviceStageService.delete(serviceStageId);
  }
}
