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
import { BlackListService } from './black-list.service';
import { ListBlackListResponseDto } from './dto/list-black-list-response.dto';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { RoleGuard } from '../../auth/guard/role.guard';
import { QueryBlackListDto } from './dto/query-black-list.dto';
import { CreateBlackListResponseDto } from './dto/create-black-list-response.dto';
import { CreateBlackListDto } from './dto/create-black-list.dto';
import { FindBlackListResponseDto } from './dto/find-black-list-response.dto';
import { UpdateBlackListResponseDto } from './dto/update-black-list-response.dto';
import { UpdateBlackListDto } from './dto/update-black-list.dto';
import { AppModule } from '../../auth/decorator/app-module.decorator';
import { AccessPermission } from '../../auth/decorator/access-permission.decorator';

@Controller('black-list/item')
@ApiTags('black-list')
@AppModule('BLACK_LIST_ITEM')
export class BlackListController {
  constructor(private readonly blackListService: BlackListService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListBlackListResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async list(
    @Query(ValidationPipe) queryBlackListDto: QueryBlackListDto,
  ): Promise<ListBlackListResponseDto> {
    return this.blackListService.list(queryBlackListDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateBlackListResponseDto,
  })
  @ApiBody({
    type: CreateBlackListDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
  public async create(
    @Body(ValidationPipe) createBlackListDto: CreateBlackListDto,
  ): Promise<CreateBlackListResponseDto> {
    return this.blackListService.create(createBlackListDto);
  }

  @Get(':blackListItemId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindBlackListResponseDto,
  })
  @ApiNotFoundResponse()
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('blackListItemId', ParseIntPipe) blackListItemId: number,
  ): Promise<FindBlackListResponseDto> {
    let blackListItem: FindBlackListResponseDto;

    try {
      blackListItem = await this.blackListService.find(blackListItemId);
    } catch (err) {
      throw new NotFoundException('could not find the black list item');
    }

    return blackListItem;
  }

  @Put(':blackListItemId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateBlackListResponseDto,
  })
  @ApiBody({
    type: UpdateBlackListDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('blackListItemId', ParseIntPipe) blackListItemId: number,
    @Body(ValidationPipe) updateBlackListDto: UpdateBlackListDto,
  ): Promise<UpdateBlackListResponseDto> {
    return this.blackListService.update(blackListItemId, updateBlackListDto);
  }

  @Delete(':blackListItemId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('blackListItemId', ParseIntPipe) blackListItemId: number,
  ): Promise<boolean> {
    return this.blackListService.delete(blackListItemId);
  }
}
