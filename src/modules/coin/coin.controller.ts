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
import { CoinService } from './coin.service';
import { ListCoinResponseDto } from './dto/list-coin-response.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { UserRole } from '../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../user-type/type/user-type.enum';
import { CreateCoinResponseDto } from './dto/create-coin-response.dto';
import { CreateCoinDto } from './dto/create-coin.dto';
import { FindCoinResponseDto } from './dto/find-coin-response.dto';
import { UpdateCoinResponseDto } from './dto/update-coin-response.dto';
import { UpdateCoinDto } from './dto/update-coin.dto';

@Controller('coin')
@ApiTags('coin')
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
  @UserRole(UserTypeEnum.ADMIN)
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
  @UserRole(UserTypeEnum.ADMIN)
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
  @ApiParam({
    type: Number,
    allowEmptyValue: false,
    example: 1,
    name: 'coinId',
    description: 'coin entity identification',
    required: true,
  })
  @ApiNotFoundResponse({
    description: 'could not find the coin',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async find(
    @Param('coinId', ValidationPipe) coinId: number,
  ): Promise<FindCoinResponseDto> {
    const coin = await this.coinService.find(coinId);

    if (!coin) {
      throw new HttpException('could not find the coin', HttpStatus.NOT_FOUND);
    }

    return coin;
  }

  @Put(':coinId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateCoinResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Even though all the properties in body are optional, at least one property is required',
  })
  @ApiParam({
    type: Number,
    allowEmptyValue: false,
    example: 1,
    name: 'coinId',
    description: 'coin entity identification',
    required: true,
  })
  @ApiBody({
    type: UpdateCoinDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async update(
    @Param('coinId', ValidationPipe) coinId: number,
    @Body(ValidationPipe) updateCoinDto: UpdateCoinDto,
  ): Promise<UpdateCoinResponseDto> {
    let coin: UpdateCoinResponseDto;

    try {
      coin = await this.coinService.update(coinId, updateCoinDto);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }

    return coin;
  }

  @Delete(':coinId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @ApiParam({
    type: Number,
    allowEmptyValue: false,
    example: 1,
    name: 'coinId',
    description: 'coin entity identification',
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async delete(
    @Param('coinId', ValidationPipe) coinId: number,
  ): Promise<boolean> {
    return this.coinService.delete(coinId);
  }
}
