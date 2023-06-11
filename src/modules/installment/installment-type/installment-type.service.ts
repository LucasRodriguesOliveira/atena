import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstallmentType } from './entity/installment-type.entity';
import { Like, Repository } from 'typeorm';
import { FindInstallmentTypeResponseDto } from './dto/find-installment-type-response.dto';
import { QueryInstallmentTypeDto } from './dto/query-installment-type.dto';
import { ListInstallmentTypeResponseDto } from './dto/list-installment-type-response.dto';
import { CreateInstallmentTypeDto } from './dto/create-installment-type.dto';
import { CreateInstallmentTypeResponseDto } from './dto/create-installment-type-response.dto';
import { UpdateInstallmentTypeDto } from './dto/update-installment-type.dto';
import { UpdateInstallmentTypeResponseDto } from './dto/update-installment-type-response.dto';

@Injectable()
export class InstallmentTypeService {
  constructor(
    @InjectRepository(InstallmentType)
    private readonly installmentTypeRepository: Repository<InstallmentType>,
  ) {}

  public async find(
    installmentTypeId: number,
  ): Promise<FindInstallmentTypeResponseDto> {
    const installmentType =
      await this.installmentTypeRepository.findOneByOrFail({
        id: installmentTypeId,
      });

    return FindInstallmentTypeResponseDto.from(installmentType);
  }

  public async list({
    description,
  }: QueryInstallmentTypeDto): Promise<ListInstallmentTypeResponseDto[]> {
    const installmentTypes = await this.installmentTypeRepository.find({
      select: ['id', 'description'],
      where: {
        ...(description ? { description: Like(description) } : {}),
      },
    });

    return ListInstallmentTypeResponseDto.from(installmentTypes);
  }

  public async create(
    createInstallmentTypeDto: CreateInstallmentTypeDto,
  ): Promise<CreateInstallmentTypeResponseDto> {
    const installmentType = await this.installmentTypeRepository.save(
      createInstallmentTypeDto,
    );

    return CreateInstallmentTypeResponseDto.from(installmentType);
  }

  public async update(
    installmentTypeId: number,
    updateInstallmentTypeDto: UpdateInstallmentTypeDto,
  ): Promise<UpdateInstallmentTypeResponseDto> {
    await this.installmentTypeRepository.update(
      { id: installmentTypeId },
      { ...updateInstallmentTypeDto },
    );

    const installmentType = await this.installmentTypeRepository.findOneBy({
      id: installmentTypeId,
    });

    return UpdateInstallmentTypeResponseDto.from(installmentType);
  }

  public async delete(installmentTypeId: number): Promise<boolean> {
    const { affected } = await this.installmentTypeRepository.softDelete({
      id: installmentTypeId,
    });

    return affected > 0;
  }
}
