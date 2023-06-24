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
import { CostumerServiceService } from './costumer-service.service';
import { ListCostumerServiceResponseDto } from './dto/list-costumer-service-response.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { UserRole } from '../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../user-type/type/user-type.enum';
import { QueryCostumerServiceDto } from './dto/query-costumer-service.dto';
import { FindCostumerServiceResponseDto } from './dto/find-costumer-service-response.dto';
import { CreateCostumerServiceDto } from './dto/create-costumer-service.dto';
import { UpdateCostumerServiceDto } from './dto/update-costumer-service.dto';

@Controller('costumer-service')
@ApiTags('costumer-service')
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
  @UserRole(UserTypeEnum.ADMIN)
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
  @UserRole(UserTypeEnum.ADMIN)
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
  @UserRole(UserTypeEnum.ADMIN)
  public async find(
    @Param('costumerServiceId', ValidationPipe) costumerServiceId: number,
  ): Promise<FindCostumerServiceResponseDto> {
    let costumerService: FindCostumerServiceResponseDto;

    try {
      costumerService = await this.costumerServiceService.find(
        costumerServiceId,
      );
    } catch (err) {
      throw new HttpException(
        'could not find the costumer service',
        HttpStatus.NOT_FOUND,
      );
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
  @UserRole(UserTypeEnum.ADMIN)
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
  @UserRole(UserTypeEnum.ADMIN)
  public async delete(
    @Param('costumerServiceId', ValidationPipe) costumerServiceId: number,
  ): Promise<boolean> {
    return this.costumerServiceService.delete(costumerServiceId);
  }
}
