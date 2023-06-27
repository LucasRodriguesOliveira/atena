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
  ApiTags,
} from '@nestjs/swagger';
import { CoinService } from './coin.service';
import { ListCoinResponseDto } from './dto/list-coin-response.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { CreateCoinResponseDto } from './dto/create-coin-response.dto';
import { CreateCoinDto } from './dto/create-coin.dto';
import { FindCoinResponseDto } from './dto/find-coin-response.dto';
import { UpdateCoinResponseDto } from './dto/update-coin-response.dto';
import { UpdateCoinDto } from './dto/update-coin.dto';
import { AppModule } from '../auth/decorator/app-module.decorator';
import { AccessPermission } from '../auth/decorator/access-permission.decorator';

@Controller('coin')
@ApiTags('coin')
@AppModule('COIN')
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListCoinResponseDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async list(): Promise<ListCoinResponseDto[]> {
    return this.coinService.list();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateCoinResponseDto,
  })
  @ApiBody({ type: CreateCoinDto })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
  public async create(
    @Body(ValidationPipe) createCoinDto: CreateCoinDto,
  ): Promise<CreateCoinResponseDto> {
    return this.coinService.create(createCoinDto);
  }

  @Get(':coinId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindCoinResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'could not find the coin',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('coinId', ValidationPipe) coinId: number,
  ): Promise<FindCoinResponseDto> {
    const coin = await this.coinService.find(coinId);

    if (!coin) {
      throw new NotFoundException('could not find the coin');
    }

    return coin;
  }

  @Put(':coinId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateCoinResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiBody({
    type: UpdateCoinDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('coinId', ValidationPipe) coinId: number,
    @Body(ValidationPipe) updateCoinDto: UpdateCoinDto,
  ): Promise<UpdateCoinResponseDto> {
    return this.coinService.update(coinId, updateCoinDto);
  }

  @Delete(':coinId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('coinId', ValidationPipe) coinId: number,
  ): Promise<boolean> {
    return this.coinService.delete(coinId);
  }
}
