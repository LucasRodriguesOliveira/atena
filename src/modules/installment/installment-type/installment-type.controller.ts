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
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ListInstallmentTypeResponseDto } from './dto/list-installment-type-response.dto';
import { QueryInstallmentTypeDto } from './dto/query-installment-type.dto';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { RoleGuard } from '../../auth/guard/role.guard';
import { UserRole } from '../../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../../user-type/type/user-type.enum';
import { InstallmentTypeService } from './installment-type.service';
import { CreateInstallmentTypeResponseDto } from './dto/create-installment-type-response.dto';
import { CreateInstallmentTypeDto } from './dto/create-installment-type.dto';
import { FindInstallmentTypeResponseDto } from './dto/find-installment-type-response.dto';
import { randomInt } from 'crypto';
import { UpdateInstallmentTypeResponseDto } from './dto/update-installment-type-response.dto';
import { UpdateInstallmentTypeDto } from './dto/update-installment-type.dto';

@Controller('installment/type')
@ApiTags('installment/type')
export class InstallmentTypeController {
  constructor(
    private readonly installmentTypeService: InstallmentTypeService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListInstallmentTypeResponseDto,
    isArray: true,
  })
  @ApiQuery({
    type: QueryInstallmentTypeDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async list(
    @Query(ValidationPipe) queryInstallmentTypeDto: QueryInstallmentTypeDto,
  ): Promise<ListInstallmentTypeResponseDto[]> {
    return this.installmentTypeService.list(queryInstallmentTypeDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateInstallmentTypeResponseDto,
  })
  @ApiBody({
    type: CreateInstallmentTypeDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async create(
    @Body(ValidationPipe) createInstallmentTypeDto: CreateInstallmentTypeDto,
  ): Promise<CreateInstallmentTypeResponseDto> {
    return this.installmentTypeService.create(createInstallmentTypeDto);
  }

  @Get(':installmentTypeId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindInstallmentTypeResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the Installment Type <installmentTypeId>',
  })
  @ApiParam({
    type: Number,
    required: true,
    example: randomInt(1, 100),
    name: 'installmentTypeId',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async find(
    @Param('installmentTypeId') installmentTypeId: number,
  ): Promise<FindInstallmentTypeResponseDto> {
    let installmentType: FindInstallmentTypeResponseDto;

    try {
      installmentType = await this.installmentTypeService.find(
        installmentTypeId,
      );
    } catch (err) {
      throw new HttpException(
        `Could not find the Installment Type [${installmentTypeId}]`,
        HttpStatus.NOT_FOUND,
      );
    }

    return installmentType;
  }

  @Put(':installmentTypeId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateInstallmentTypeResponseDto,
  })
  @ApiParam({
    type: Number,
    required: true,
    example: randomInt(1, 100),
    name: 'installmentTypeId',
  })
  @ApiBody({
    type: UpdateInstallmentTypeDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async update(
    @Param('installmentTypeId', ValidationPipe) installmentTypeId: number,
    @Body(ValidationPipe) updateInstallmentTypeDto: UpdateInstallmentTypeDto,
  ): Promise<UpdateInstallmentTypeResponseDto> {
    console.log(updateInstallmentTypeDto);
    if (Object.keys(updateInstallmentTypeDto).length === 0) {
      throw new HttpException(
        'inform description or status to update the installment type',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.installmentTypeService.update(
      installmentTypeId,
      updateInstallmentTypeDto,
    );
  }

  @Delete(':installmentTypeId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @ApiParam({
    type: Number,
    required: true,
    example: randomInt(1, 100),
    name: 'installmentTypeId',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async delete(
    @Param('installmentTypeId', ValidationPipe) installmentTypeId: number,
  ): Promise<boolean> {
    return this.installmentTypeService.delete(installmentTypeId);
  }
}
