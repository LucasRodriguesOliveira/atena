import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Installment } from './entity/installment.entity';
import { Repository } from 'typeorm';
import { FindInstallmentResponseDto } from './dto/find-installment-respose.dto';
import { QueryInstallmentDto } from './dto/query-installment.dto';
import { ListInstallmentResponseDto } from './dto/list-installment-response.dto';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { CreateInstallmentResponseDto } from './dto/create-installment-response.dto';
import { Contract } from '../../contract/entity/contract.entity';
import { InstallmentType } from '../type/entity/installment-type.entity';
import { PaymentMethod } from '../../payment-method/entity/payment-method.entity';
import { Coin } from '../../coin/entity/coin.entity';
import { UpdateInstallmentResponseDto } from './dto/update-installment.response.dto';

@Injectable()
export class InstallmentService {
  constructor(
    @InjectRepository(Installment)
    private readonly installmentRepository: Repository<Installment>,

    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    @InjectRepository(InstallmentType)
    private readonly installmentTypeRepository: Repository<InstallmentType>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
  ) {}

  public async find(
    installmentId: string,
  ): Promise<FindInstallmentResponseDto> {
    const installment = await this.installmentRepository.findOneOrFail({
      select: [
        'id',
        'contract',
        'installmentType',
        'paymentMethod',
        'coin',
        'value',
        'valuePaid',
        'expiresAt',
        'paidAt',
        'createdAt',
      ],
      where: { id: installmentId },
      relations: {
        contract: {
          servicePack: true,
        },
        installmentType: true,
        paymentMethod: true,
        coin: true,
      },
    });

    return FindInstallmentResponseDto.from(installment);
  }

  public async list({
    servicePackId,
    companyId,
    installmentTypeId,
    coinId,
    isExpired,
    isPaid,
    isValueDivergent,
    page = 0,
    items = 10,
  }: QueryInstallmentDto): Promise<ListInstallmentResponseDto> {
    const queryBuilder = this.installmentRepository
      .createQueryBuilder('installment')
      .select('installment.id')
      .addSelect('installment.value')
      .addSelect('installment.valuePaid')
      .addSelect('installment.expiresAt')
      .addSelect('contract.id')
      .addSelect('company.id')
      .addSelect('company.name')
      .addSelect('service_pack.id')
      .addSelect('service_pack.description')
      .addSelect('installment_type.id')
      .addSelect('installment_type.description')
      .addSelect('coin.id')
      .addSelect('coin.acronym')
      .leftJoinAndSelect('installment.contract', 'contract')
      .leftJoinAndSelect('contract.company', 'company')
      .leftJoinAndSelect('contract.servicePack', 'service_pack')
      .leftJoinAndSelect('installment.coin', 'coin')
      .leftJoinAndSelect('installment.installmentType', 'installment_type');

    if (servicePackId) {
      queryBuilder.andWhere('service_pack.id = :servicePackId', {
        servicePackId,
      });
    }

    if (companyId) {
      queryBuilder.andWhere('company.id = :companyId', {
        companyId,
      });
    }

    if (installmentTypeId) {
      queryBuilder.andWhere('installment_type.id = :installmentTypeId', {
        installmentTypeId,
      });
    }

    if (coinId) {
      queryBuilder.andWhere('coin.id = :coinId', { coinId });
    }

    if (isExpired) {
      queryBuilder.andWhere('installment.expiresAt < now()::date');
    }

    if (isPaid) {
      queryBuilder
        .andWhere('installment.paidAt IS NOT NULL')
        .andWhere('installment.valuePaid > 0');
    }

    if (isValueDivergent) {
      queryBuilder
        .andWhere('installment.value <> installment.valuePaid')
        .andWhere('installment.valuePaid > 0');
    }

    queryBuilder.skip(page * items).take(items);

    const [installments, total] = await queryBuilder.getManyAndCount();

    return ListInstallmentResponseDto.from(installments, total);
  }

  public async create(
    createInstallmentDto: CreateInstallmentDto,
  ): Promise<CreateInstallmentResponseDto> {
    const [contract, installmentType, paymentMethod, coin] = await Promise.all([
      this.contractRepository.findOne({
        where: { id: createInstallmentDto.contractId },
        relations: {
          company: true,
          servicePack: true,
        },
      }),
      this.installmentTypeRepository.findOneBy({
        id: createInstallmentDto.installmentTypeId,
      }),
      this.paymentMethodRepository.findOneBy({
        id: createInstallmentDto.paymentMethodId,
      }),
      this.coinRepository.findOneBy({ id: createInstallmentDto.coinId }),
    ]);

    const installment = await this.installmentRepository.save({
      ...createInstallmentDto,
      contract,
      installmentType,
      paymentMethod,
      coin,
    });

    return CreateInstallmentResponseDto.from(installment);
  }

  public async pay(
    installmentId: string,
    value: number,
  ): Promise<UpdateInstallmentResponseDto> {
    await this.installmentRepository.update(
      { id: installmentId },
      { valuePaid: value, paidAt: new Date() },
    );

    const installment = await this.installmentRepository.findOne({
      select: [
        'id',
        'contract',
        'installmentType',
        'paymentMethod',
        'coin',
        'value',
        'valuePaid',
        'expiresAt',
        'paidAt',
        'createdAt',
      ],
      where: { id: installmentId },
      relations: {
        contract: {
          servicePack: true,
        },
        installmentType: true,
        paymentMethod: true,
        coin: true,
      },
    });

    return UpdateInstallmentResponseDto.from(installment);
  }

  public async delete(installmentId: string): Promise<boolean> {
    const { affected } = await this.installmentRepository.softDelete({
      id: installmentId,
    });

    return affected > 0;
  }
}
