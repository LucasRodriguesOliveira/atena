import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentMethodService } from './payment-method.service';
import { ListPaymentMethodResponseDto } from './dto/list-payment-method-response.dto';
import { QueryPaymentMethodDto } from './dto/query-payment-method.dto';
import { CreatePaymentMethodResponseDto } from './dto/create-payment-method-response.dto';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { FindPaymentMethodResponseDto } from './dto/find-payment-method-response.dto';
import { UpdatePaymentMethodResponseDto } from './dto/update-payment-method-response.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { AppModule } from '../auth/decorator/app-module.decorator';
import { AccessPermission } from '../auth/decorator/access-permission.decorator';

@Controller('payment-method')
@ApiTags('payment-method')
@AppModule('PAYMENT_METHOD')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListPaymentMethodResponseDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
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
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
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
  @ApiNotFoundResponse()
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('paymentMethodId', ParseIntPipe) paymentMethodId: number,
  ): Promise<FindPaymentMethodResponseDto> {
    let paymentMethod: FindPaymentMethodResponseDto;

    try {
      paymentMethod = await this.paymentMethodService.find(paymentMethodId);
    } catch (err) {
      throw new NotFoundException('could not find Payment Method');
    }

    return paymentMethod;
  }

  @Put(':paymentMethodId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdatePaymentMethodResponseDto,
  })
  @ApiBody({
    type: UpdatePaymentMethodDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('paymentMethodId', ParseIntPipe) paymentMethodId: number,
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
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('paymentMethodId', ValidationPipe) paymentMethodId: number,
  ): Promise<boolean> {
    return this.paymentMethodService.delete(paymentMethodId);
  }
}
