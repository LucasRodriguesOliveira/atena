import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ServicePackService } from './service-pack.service';
import { ListServicePackResponseDto } from './dto/list-service-pack-response.dto';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { RoleGuard } from '../../auth/guard/role.guard';
import { UserRole } from '../../auth/decorator/user-type.decorator';
import { QueryListServicePackDto } from './dto/query-list-service-pack.dto';
import { UserTypeEnum } from '../../user-type/type/user-type.enum';
import { CreateServicePackResponseDto } from './dto/create-service-pack-response.dto';
import { CreateServicePackDto } from './dto/create-service-pack.dto';
import { FindServicePackResponseDto } from './dto/find-service-pack-response.dto';
import { randomUUID } from 'crypto';
import { UpdateServicePackDto } from './dto/update-service-pack.dto';
import { UpdateServicePackResponseDto } from './dto/update-service-pack-response.dto';

@Controller('service-pack')
@ApiTags('service-pack')
export class ServicePackController {
  constructor(private readonly servicePackService: ServicePackService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListServicePackResponseDto,
    isArray: true,
  })
  @ApiQuery({
    type: QueryListServicePackDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
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
  @UserRole(UserTypeEnum.ADMIN)
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
  @ApiParam({
    type: String,
    name: 'servicePackId',
    allowEmptyValue: false,
    required: true,
    example: randomUUID(),
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async find(
    @Param('servicePackId', ValidationPipe) servicePackId: string,
  ): Promise<FindServicePackResponseDto> {
    return this.servicePackService.find(servicePackId);
  }

  @Put(':servicePackId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateServicePackResponseDto,
  })
  @ApiParam({
    type: String,
    name: 'servicePackId',
    allowEmptyValue: false,
    required: true,
    example: randomUUID(),
  })
  @ApiBody({
    type: UpdateServicePackDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async update(
    @Param('servicePackId', ValidationPipe) servicePackId: string,
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
  @ApiParam({
    type: String,
    name: 'servicePackId',
    allowEmptyValue: false,
    required: true,
    example: randomUUID(),
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async delete(
    @Param('servicePackId', ValidationPipe) servicePackId: string,
  ): Promise<boolean> {
    return this.servicePackService.delete(servicePackId);
  }
}
