import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
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
import { UserRole } from '../../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../../user-type/type/user-type.enum';
import { QueryBlackListDto } from './dto/query-black-list.dto';
import { CreateBlackListResponseDto } from './dto/create-black-list-response.dto';
import { CreateBlackListDto } from './dto/create-black-list.dto';
import { FindBlackListResponseDto } from './dto/find-black-list-response.dto';
import { UpdateBlackListResponseDto } from './dto/update-black-list-response.dto';
import { UpdateBlackListDto } from './dto/update-black-list.dto';

@Controller('black-list/item')
@ApiTags('black-list')
export class BlackListController {
  constructor(private readonly blackListService: BlackListService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListBlackListResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
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
  @UserRole(UserTypeEnum.ADMIN)
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
  @UserRole(UserTypeEnum.ADMIN)
  public async find(
    @Param('blackListItemId', ParseIntPipe) blackListItemId: number,
  ): Promise<FindBlackListResponseDto> {
    let blackListItem: FindBlackListResponseDto;

    try {
      blackListItem = await this.blackListService.find(blackListItemId);
    } catch (err) {
      throw new HttpException(
        'could not find the black list item',
        HttpStatus.NOT_FOUND,
      );
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
  @UserRole(UserTypeEnum.ADMIN)
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
  @UserRole(UserTypeEnum.ADMIN)
  public async delete(
    @Param('blackListItemId', ParseIntPipe) blackListItemId: number,
  ): Promise<boolean> {
    return this.blackListService.delete(blackListItemId);
  }
}
