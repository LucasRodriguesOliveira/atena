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
  ApiTags,
} from '@nestjs/swagger';
import { InstallmentService } from './installment.service';
import { randomUUID } from 'crypto';
import { FindInstallmentResponseDto } from './dto/find-installment-respose.dto';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { RoleGuard } from '../../auth/guard/role.guard';
import { UserRole } from '../../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../../user-type/type/user-type.enum';
import { QueryInstallmentDto } from './dto/query-installment.dto';
import { ListInstallmentResponseDto } from './dto/list-installment-response.dto';
import { CreateInstallmentResponseDto } from './dto/create-installment-response.dto';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { UpdateInstallmentResponseDto } from './dto/update-installment.response.dto';
import { UpdateInstallmentDto } from './dto/update-installment.dto';

@Controller('installment/item')
@ApiTags('installment')
export class InstallmentController {
  constructor(private readonly installmentService: InstallmentService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListInstallmentResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async list(
    @Query(ValidationPipe) queryInstallmentDto: QueryInstallmentDto,
  ): Promise<any> {
    return this.installmentService.list(queryInstallmentDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateInstallmentResponseDto,
  })
  @ApiBody({
    type: CreateInstallmentDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async create(
    @Body(ValidationPipe) createInstallmentDto: CreateInstallmentDto,
  ): Promise<CreateInstallmentResponseDto> {
    return this.installmentService.create(createInstallmentDto);
  }

  @Get(':installmentId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindInstallmentResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the installment <installmentId>',
  })
  @ApiParam({
    type: String,
    required: true,
    name: 'installmentId',
    example: randomUUID(),
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async find(
    @Param('installmentId', ValidationPipe) installmentId: string,
  ): Promise<FindInstallmentResponseDto> {
    let installment: FindInstallmentResponseDto;

    try {
      installment = await this.installmentService.find(installmentId);
    } catch (err) {
      throw new HttpException(
        `Cound not find the installment [${installmentId}]`,
        HttpStatus.NOT_FOUND,
      );
    }

    return installment;
  }

  @Put(':installmentId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateInstallmentResponseDto,
  })
  @ApiBody({
    type: UpdateInstallmentDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async pay(
    @Param('installmentId', ValidationPipe) installmentId: string,
    @Body(ValidationPipe) updateInstallmentDto: UpdateInstallmentDto,
  ): Promise<UpdateInstallmentResponseDto> {
    return this.installmentService.pay(
      installmentId,
      updateInstallmentDto.value,
    );
  }

  @Delete(':installmentId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async delete(
    @Param('installmentId', ValidationPipe) installmentId: string,
  ): Promise<boolean> {
    return this.installmentService.delete(installmentId);
  }
}
