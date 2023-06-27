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
  UseGuards,
  ValidationPipe,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ServicePackItemService } from './service-pack-item.service';
import { CreateServicePackItemResponseDto } from './dto/create-service-pack-item-response.dto';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { RoleGuard } from '../../auth/guard/role.guard';
import { CreateServicePackItemDto } from './dto/create-service-pack-item.dto';
import { FindServicePackItemResponseDto } from './dto/find-service-pack-item-response.dto';
import { UpdateServicePackItemResponseDto } from './dto/update-service-pack-item-response.dto';
import { UpdateServicePackItemDto } from './dto/update-service-pack-item.dto';
import { AppModule } from '../../auth/decorator/app-module.decorator';
import { AccessPermission } from '../../auth/decorator/access-permission.decorator';

@Controller('service-pack/item')
@ApiTags('service-pack')
@AppModule('SERVICE_PACK_ITEM')
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
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
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
  @ApiNotFoundResponse()
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('servicePackItemId', ParseIntPipe) servicePackItemId: number,
  ): Promise<FindServicePackItemResponseDto> {
    let servicePackItem: FindServicePackItemResponseDto;

    try {
      servicePackItem = await this.servicePackItemService.find(
        servicePackItemId,
      );
    } catch (err) {
      throw new NotFoundException('could not find the Service Pack Item');
    }

    return servicePackItem;
  }

  @Put(':servicePackItemId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateServicePackItemResponseDto,
  })
  @ApiBody({
    type: UpdateServicePackItemDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('servicePackItemId', ParseIntPipe) servicePackItemId: number,
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
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('servicePackItemId', ParseIntPipe) servicePackItemId: number,
  ): Promise<boolean> {
    return this.servicePackItemService.delete(servicePackItemId);
  }
}
