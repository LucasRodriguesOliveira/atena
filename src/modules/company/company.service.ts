import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entity/company.entity';
import { Like, Repository } from 'typeorm';
import { FindCompanyResponseDto } from './dto/find-company-response.dto';
import { QueryListCompanyDto } from './dto/query-list-company.dto';
import { ListCompanyResponseDto } from './dto/list-company-response.dto';
import { CompanyStatusEnum } from './type/company-status.enum';
import { PaginatedResult } from 'src/shared/paginated-result.interface';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateCompanyResponseDto } from './dto/create-company-response.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateCompanyResponseDto } from './dto/update-company-response.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  public async find(companyId: string): Promise<FindCompanyResponseDto | null> {
    const company = await this.companyRepository.findOne({
      select: ['id', 'name', 'displayName', 'email'],
      where: {
        id: companyId,
      },
    });

    if (!Object.keys(company).length) {
      return null;
    }

    return FindCompanyResponseDto.from(company);
  }

  public async list({
    page = 0,
    name,
    status,
  }: QueryListCompanyDto): Promise<PaginatedResult<ListCompanyResponseDto>> {
    const maxResults = 10;
    let query;

    if (name) {
      query = [{ name: Like(name) }, { displayName: Like(name) }];
    }

    if (status) {
      let statusQuery = {};
      switch (status) {
        case CompanyStatusEnum.ACTIVE:
          statusQuery = { status: true };
          break;
        case CompanyStatusEnum.INACTIVE:
          statusQuery = { status: false };
          break;
      }

      if (Object.keys(statusQuery).length > 0) {
        if (Array.isArray(query)) {
          query.push(statusQuery);
        } else {
          query = statusQuery;
        }
      }
    }

    const [companies, count] = await this.companyRepository.findAndCount({
      where: query,
      skip: page,
      take: maxResults,
    });

    return ListCompanyResponseDto.from({
      companies,
      count,
    });
  }

  public async create(
    createCompanyDto: CreateCompanyDto,
  ): Promise<CreateCompanyResponseDto> {
    const company = await this.companyRepository.save({
      ...createCompanyDto,
    });

    return CreateCompanyResponseDto.from(company);
  }

  public async update(
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<UpdateCompanyResponseDto> {
    await this.companyRepository.update(
      { id: companyId },
      { ...updateCompanyDto },
    );

    const company = await this.companyRepository.findOne({
      where: {
        id: companyId,
      },
    });

    return UpdateCompanyResponseDto.from(company);
  }

  public async delete(companyId: string): Promise<boolean> {
    const { affected } = await this.companyRepository.softDelete({
      id: companyId,
    });

    return affected > 0;
  }
}
