import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
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
import { UpdateInstallmentTypeResponseDto } from './dto/update-installment-type-response.dto';
import { UpdateInstallmentTypeDto } from './dto/update-installment-type.dto';
import { AppModule } from '../../auth/decorator/app-module.decorator';
import { AccessPermission } from '../../auth/decorator/access-permission.decorator';

@Controller('installment/type')
@ApiTags('installment')
@AppModule('INSTALLMENT_TYPE')
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
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  @AccessPermission('LIST')
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
  @AccessPermission('CREATE')
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
  @ApiNotFoundResponse()
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('installmentTypeId', ParseIntPipe) installmentTypeId: number,
  ): Promise<FindInstallmentTypeResponseDto> {
    let installmentType: FindInstallmentTypeResponseDto;

    try {
      installmentType = await this.installmentTypeService.find(
        installmentTypeId,
      );
    } catch (err) {
      throw new NotFoundException(
        `Could not find the Installment Type [${installmentTypeId}]`,
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
  @ApiBody({
    type: UpdateInstallmentTypeDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('installmentTypeId', ParseIntPipe) installmentTypeId: number,
    @Body(ValidationPipe) updateInstallmentTypeDto: UpdateInstallmentTypeDto,
  ): Promise<UpdateInstallmentTypeResponseDto> {
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
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('installmentTypeId', ParseIntPipe) installmentTypeId: number,
  ): Promise<boolean> {
    return this.installmentTypeService.delete(installmentTypeId);
  }
}
