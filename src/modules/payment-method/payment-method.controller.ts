import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Query,
  Param,
  Post,
  Put,
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
import { PaymentMethodService } from './payment-method.service';
import { ListPaymentMethodResponseDto } from './dto/list-payment-method-response.dto';
import { QueryPaymentMethodDto } from './dto/query-payment-method.dto';
import { CreatePaymentMethodResponseDto } from './dto/create-payment-method-response.dto';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { UserRole } from '../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../user-type/type/user-type.enum';
import { FindPaymentMethodResponseDto } from './dto/find-payment-method-response.dto';
import { UpdatePaymentMethodResponseDto } from './dto/update-payment-method-response.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Controller('payment-method')
@ApiTags('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListPaymentMethodResponseDto,
    isArray: true,
  })
  @ApiQuery({
    type: QueryPaymentMethodDto,
    required: false,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async list(
    @Query(ValidationPipe) queryPaymentMethodDto?: QueryPaymentMethodDto,
  ): Promise<ListPaymentMethodResponseDto[]> {
    return this.paymentMethodService.list(queryPaymentMethodDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreatePaymentMethodResponseDto,
  })
  @ApiBody({
    type: CreatePaymentMethodDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async create(
    @Body(ValidationPipe) createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<CreatePaymentMethodResponseDto> {
    return this.paymentMethodService.create(createPaymentMethodDto);
  }

  @Get(':paymentMethodId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindPaymentMethodResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'could not find the Payment Method',
  })
  @ApiParam({
    type: Number,
    required: true,
    name: 'paymentMethodId',
    example: 1,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async find(
    @Param('paymentMethodId', ValidationPipe) paymentMethodId: number,
  ): Promise<FindPaymentMethodResponseDto> {
    const paymentMethod = await this.paymentMethodService.find(paymentMethodId);

    if (!paymentMethod) {
      throw new HttpException(
        'could not find Payment Method',
        HttpStatus.NOT_FOUND,
      );
    }

    return paymentMethod;
  }

  @Put(':paymentMethodId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdatePaymentMethodResponseDto,
  })
  @ApiParam({
    type: Number,
    name: 'paymentMethodId',
    example: 1,
  })
  @ApiBody({
    type: UpdatePaymentMethodDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async update(
    @Param('paymentMethodId', ValidationPipe) paymentMethodId: number,
    @Body(ValidationPipe) updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<UpdatePaymentMethodResponseDto> {
    return this.paymentMethodService.update(
      paymentMethodId,
      updatePaymentMethodDto,
    );
  }

  @Delete(':paymentMethodId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @ApiParam({
    type: Number,
    name: 'paymentMethodId',
    example: 1,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async delete(
    @Param('paymentMethodId', ValidationPipe) paymentMethodId: number,
  ): Promise<boolean> {
    return this.paymentMethodService.delete(paymentMethodId);
  }
}
