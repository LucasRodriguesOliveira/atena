import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
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
import { CostumerServiceService } from './costumer-service.service';
import { ListCostumerServiceResponseDto } from './dto/list-costumer-service-response.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { QueryCostumerServiceDto } from './dto/query-costumer-service.dto';
import { FindCostumerServiceResponseDto } from './dto/find-costumer-service-response.dto';
import { CreateCostumerServiceDto } from './dto/create-costumer-service.dto';
import { UpdateCostumerServiceDto } from './dto/update-costumer-service.dto';
import { AppModule } from '../auth/decorator/app-module.decorator';
import { AccessPermission } from '../auth/decorator/access-permission.decorator';

@Controller('costumer-service')
@ApiTags('costumer-service')
@AppModule('COSTUMER_SERVICE')
export class CostumerServiceController {
  constructor(
    private readonly costumerServiceService: CostumerServiceService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListCostumerServiceResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async list(
    @Query(ValidationPipe) queryCostumerServiceDto: QueryCostumerServiceDto,
  ): Promise<ListCostumerServiceResponseDto> {
    return this.costumerServiceService.list(queryCostumerServiceDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: FindCostumerServiceResponseDto,
  })
  @ApiBody({
    type: CreateCostumerServiceDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
  public async create(
    @Body(ValidationPipe) createCostumerServiceDto: CreateCostumerServiceDto,
  ): Promise<FindCostumerServiceResponseDto> {
    return this.costumerServiceService.create(createCostumerServiceDto);
  }

  @Get(':costumerServiceId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindCostumerServiceResponseDto,
  })
  @ApiNotFoundResponse()
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('costumerServiceId', ValidationPipe) costumerServiceId: number,
  ): Promise<FindCostumerServiceResponseDto> {
    let costumerService: FindCostumerServiceResponseDto;

    try {
      costumerService = await this.costumerServiceService.find(
        costumerServiceId,
      );
    } catch (err) {
      throw new NotFoundException('could not find the costumer service');
    }

    return costumerService;
  }

  @Put(':costumerServiceId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindCostumerServiceResponseDto,
  })
  @ApiBody({
    type: UpdateCostumerServiceDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('costumerServiceId', ValidationPipe) costumerServiceId: number,
    @Body(ValidationPipe) updateCostumerServiceDto: UpdateCostumerServiceDto,
  ): Promise<FindCostumerServiceResponseDto> {
    return this.costumerServiceService.update(
      costumerServiceId,
      updateCostumerServiceDto,
    );
  }

  @Delete(':costumerServiceId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('costumerServiceId', ValidationPipe) costumerServiceId: number,
  ): Promise<boolean> {
    return this.costumerServiceService.delete(costumerServiceId);
  }
}
