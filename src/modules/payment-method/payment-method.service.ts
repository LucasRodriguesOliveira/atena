import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from './entity/payment-method.entity';
import { Like, Repository } from 'typeorm';
import { FindPaymentMethodResponseDto } from './dto/find-payment-method-response.dto';
import { QueryPaymentMethodDto } from './dto/query-payment-method.dto';
import { ListPaymentMethodResponseDto } from './dto/list-payment-method-response.dto';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { CreatePaymentMethodResponseDto } from './dto/create-payment-method-response.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { UpdatePaymentMethodResponseDto } from './dto/update-payment-method-response.dto';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  public async find(
    paymentMethodId: number,
  ): Promise<FindPaymentMethodResponseDto> {
    const paymentMethod = await this.paymentMethodRepository.findOneByOrFail({
      id: paymentMethodId,
    });

    return FindPaymentMethodResponseDto.from(paymentMethod);
  }

  public async list(
    queryPaymentMethodDto: QueryPaymentMethodDto,
  ): Promise<ListPaymentMethodResponseDto[]> {
    let description: string;

    if (queryPaymentMethodDto) {
      description = queryPaymentMethodDto.description;
    }

    const paymentMethods = await this.paymentMethodRepository.find({
      select: ['id', 'description'],
      where: {
        ...(description ? { description: Like(description) } : {}),
      },
    });

    return ListPaymentMethodResponseDto.from(paymentMethods);
  }

  public async create({
    description,
  }: CreatePaymentMethodDto): Promise<CreatePaymentMethodResponseDto> {
    const paymentMethod = await this.paymentMethodRepository.save({
      description,
    });

    return CreatePaymentMethodResponseDto.from(paymentMethod);
  }

  public async update(
    paymentMethodId: number,
    { description }: UpdatePaymentMethodDto,
  ): Promise<UpdatePaymentMethodResponseDto> {
    await this.paymentMethodRepository.update(
      { id: paymentMethodId },
      { description },
    );

    const paymentMethod = await this.paymentMethodRepository.findOneBy({
      id: paymentMethodId,
    });

    return UpdatePaymentMethodResponseDto.from(paymentMethod);
  }

  public async delete(paymentMethodId: number): Promise<boolean> {
    const { affected } = await this.paymentMethodRepository.softDelete({
      id: paymentMethodId,
    });

    return affected > 0;
  }
}
