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
import { ReasonService } from './reason.service';
import { ListReasonResponseDto } from './dto/list-reason-response.dto';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { RoleGuard } from '../../auth/guard/role.guard';
import { QueryReasonDto } from './dto/query-reason.dto';
import { CreateReasonResponseDto } from './dto/create-reason-response.dto';
import { CreateReasonDto } from './dto/create-reason.dto';
import { FindReasonResponseDto } from './dto/find-reason-response.dto';
import { UpdateReasonResponseDto } from './dto/update-reason-response.dto';
import { UpdateReasonDto } from './dto/update-reason.dto';
import { AppModule } from '../../auth/decorator/app-module.decorator';
import { AccessPermission } from '../../auth/decorator/access-permission.decorator';

@Controller('black-list/reason')
@ApiTags('black-list')
@AppModule('BLACK_LIST_REASON')
export class ReasonController {
  constructor(private readonly reasonService: ReasonService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListReasonResponseDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async list(
    @Query(ValidationPipe) queryReasonDto: QueryReasonDto,
  ): Promise<ListReasonResponseDto[]> {
    return this.reasonService.list(queryReasonDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateReasonResponseDto,
  })
  @ApiBody({
    type: CreateReasonDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
  public async create(
    @Body(ValidationPipe) createReasonDto: CreateReasonDto,
  ): Promise<CreateReasonResponseDto> {
    return this.reasonService.create(createReasonDto);
  }

  @Get(':reasonId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindReasonResponseDto,
  })
  @ApiNotFoundResponse()
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('reasonId', ValidationPipe) reasonId: number,
  ): Promise<FindReasonResponseDto> {
    let reason: FindReasonResponseDto;

    try {
      reason = await this.reasonService.find(reasonId);
    } catch (err) {
      throw new HttpException(
        'could not find the reason',
        HttpStatus.NOT_FOUND,
      );
    }

    return reason;
  }

  @Put(':reasonId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateReasonResponseDto,
  })
  @ApiBody({
    type: UpdateReasonDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('reasonId', ValidationPipe) reasonId: number,
    @Body(ValidationPipe) updateReasonDto: UpdateReasonDto,
  ): Promise<UpdateReasonResponseDto> {
    return this.reasonService.update(reasonId, updateReasonDto);
  }

  @Delete(':reasonId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('reasonId', ValidationPipe) reasonId: number,
  ): Promise<boolean> {
    return this.reasonService.delete(reasonId);
  }
}
