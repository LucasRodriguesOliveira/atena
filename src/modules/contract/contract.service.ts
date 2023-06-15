import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract } from './entity/contract.entity';
import { Repository } from 'typeorm';
import { FindContractResponseDto } from './dto/find-contract-response.dto';
import { QueryContractDto } from './dto/query-contract.dto';
import { ListContractResponseDto } from './dto/list-contract-response.dto';
import { ContractStatus } from './type/contract-status.enum';
import { CreateContractResponseDto } from './dto/create-contract-response.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import { ServicePack } from '../service-pack/service/entity/service-pack.entity';
import { Company } from '../company/entity/company.entity';
import { Client } from '../client/entity/client.entity';
import { Coin } from '../coin/entity/coin.entity';
import { UpdateContractDto } from './dto/update-contract.dto';
import { UpdateContractResponseDto } from './dto/update-contract-response.dto';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,

    @InjectRepository(ServicePack)
    private readonly servicePackRepository: Repository<ServicePack>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
  ) {}

  public async find(contractId: string): Promise<FindContractResponseDto> {
    const contract = await this.contractRepository.findOneOrFail({
      where: { id: contractId },
      relations: {
        servicePack: true,
        company: true,
        client: true,
        coin: true,
      },
    });

    return FindContractResponseDto.from(contract);
  }

  public async list({
    status,
    items = 10,
    page = 0,
  }: QueryContractDto): Promise<ListContractResponseDto> {
    let whereStatus = {};

    switch (status) {
      case ContractStatus.ACTIVE:
        whereStatus = {
          status: true,
        };
        break;
      case ContractStatus.INACTIVE:
        whereStatus = {
          status: false,
        };
        break;
    }

    const [contracts, total] = await this.contractRepository.findAndCount({
      select: ['id', 'servicePack', 'company'],
      relations: {
        servicePack: true,
        company: true,
      },
      where: {
        ...whereStatus,
      },
      skip: page * items,
      take: items,
    });

    return ListContractResponseDto.from(contracts, total);
  }

  public async create(
    createContractDto: CreateContractDto,
  ): Promise<CreateContractResponseDto> {
    const [servicePack, company, client, coin] = await Promise.all([
      this.servicePackRepository.findOneBy({
        id: createContractDto.servicePackId,
      }),
      this.companyRepository.findOneBy({ id: createContractDto.companyId }),
      this.clientRepository.findOneBy({ id: createContractDto.clientId }),
      this.coinRepository.findOneBy({ id: createContractDto.coinId }),
    ]);

    const contract = await this.contractRepository.save({
      ...createContractDto,
      servicePack,
      company,
      client,
      coin,
    });

    return CreateContractResponseDto.from(contract);
  }

  public async update(
    contractId: string,
    { status }: UpdateContractDto,
  ): Promise<UpdateContractResponseDto> {
    await this.contractRepository.update({ id: contractId }, { status });

    const contract = await this.contractRepository.findOne({
      select: ['id', 'servicePack', 'company', 'updatedAt'],
      where: { id: contractId },
      relations: {
        servicePack: true,
        company: true,
      },
    });

    return UpdateContractResponseDto.from(contract);
  }

  public async delete(contractId: string): Promise<boolean> {
    const { affected } = await this.contractRepository.softDelete({
      id: contractId,
    });

    return affected > 0;
  }
}
