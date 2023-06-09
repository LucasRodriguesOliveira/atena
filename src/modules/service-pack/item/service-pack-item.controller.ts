import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  HttpException,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ServicePackItemService } from './service-pack-item.service';
import { CreateServicePackItemResponseDto } from './dto/create-service-pack-item-response.dto';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { RoleGuard } from '../../auth/guard/role.guard';
import { UserRole } from '../../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../../user-type/type/user-type.enum';
import { CreateServicePackItemDto } from './dto/create-service-pack-item.dto';
import { FindServicePackItemResponseDto } from './dto/find-service-pack-item-response.dto';
import { UpdateServicePackItemResponseDto } from './dto/update-service-pack-item-response.dto';
import { UpdateServicePackItemDto } from './dto/update-service-pack-item.dto';

@Controller('service-pack/item')
@ApiTags('service-pack')
export class ServicePackItemController {
  constructor(
    private readonly servicePackItemService: ServicePackItemService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateServicePackItemResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiBody({
    type: CreateServicePackItemDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async create(
    @Body(ValidationPipe) createServicePackItemDto: CreateServicePackItemDto,
  ): Promise<CreateServicePackItemResponseDto> {
    return this.servicePackItemService.create(createServicePackItemDto);
  }

  @Get(':servicePackItemId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindServicePackItemResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'could not find the Service Pack Item',
  })
  @ApiParam({
    type: Number,
    name: 'servicePackItemId',
    example: 1,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async find(
    @Param('servicePackItemId', ValidationPipe) servicePackItemId: number,
  ): Promise<FindServicePackItemResponseDto> {
    const servicePackItem = await this.servicePackItemService.find(
      servicePackItemId,
    );

    if (!servicePackItem) {
      throw new HttpException(
        'could not find the Service Pack Item',
        HttpStatus.NOT_FOUND,
      );
    }

    return servicePackItem;
  }

  @Put(':servicePackItemId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateServicePackItemResponseDto,
  })
  @ApiParam({
    type: Number,
    name: 'servicePackItemId',
    example: 1,
    required: true,
  })
  @ApiBody({
    type: UpdateServicePackItemDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async update(
    @Param('servicePackItemId', ValidationPipe) servicePackItemId: number,
    @Body(ValidationPipe) updateServicePackItemDto: UpdateServicePackItemDto,
  ): Promise<UpdateServicePackItemResponseDto> {
    return this.servicePackItemService.update(
      servicePackItemId,
      updateServicePackItemDto,
    );
  }

  @Delete(':servicePackItemId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @ApiParam({
    type: Number,
    name: 'servicePackItemId',
    example: 1,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async delete(
    @Param('servicePackItemId', ValidationPipe) servicePackItemId: number,
  ): Promise<boolean> {
    return this.servicePackItemService.delete(servicePackItemId);
  }
}
