import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
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
import { UserRole } from '../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../user-type/type/user-type.enum';
import { QueryServiceStageDto } from './dto/query-service-stage.dto';
import { CreateServiceStageResponseDto } from './dto/create-service-stage-response.dto';
import { CreateServiceStageDto } from './dto/create-service-stage.dto';
import { FindServiceStageResponseDto } from './dto/find-service-stage-response.dto';
import { UpdateServiceStageResponseDto } from './dto/update-service-stage-response.dto';
import { UpdateServiceStageDto } from './dto/update-service-stage.dto';

@Controller('service-stage')
@ApiTags('service-stage')
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
  @UserRole(UserTypeEnum.ADMIN)
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
  @UserRole(UserTypeEnum.ADMIN)
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
  @UserRole(UserTypeEnum.ADMIN)
  public async find(
    @Param('serviceStageId', ValidationPipe) serviceStageId: number,
  ): Promise<FindServiceStageResponseDto> {
    let serviceStage: FindServiceStageResponseDto;

    try {
      serviceStage = await this.serviceStageService.find(serviceStageId);
    } catch (err) {
      throw new HttpException(
        'could not find the service stage',
        HttpStatus.NOT_FOUND,
      );
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
  @UserRole(UserTypeEnum.ADMIN)
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
  @UserRole(UserTypeEnum.ADMIN)
  public async delete(
    @Param('serviceStageId', ValidationPipe) serviceStageId: number,
  ): Promise<boolean> {
    return this.serviceStageService.delete(serviceStageId);
  }
}
