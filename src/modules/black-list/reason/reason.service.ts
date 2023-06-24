import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reason } from './entity/reason.entity';
import { Like, Repository } from 'typeorm';
import { FindReasonResponseDto } from './dto/find-reason-response.dto';
import { QueryReasonDto } from './dto/query-reason.dto';
import { ListReasonResponseDto } from './dto/list-reason-response.dto';
import { CreateReasonDto } from './dto/create-reason.dto';
import { CreateReasonResponseDto } from './dto/create-reason-response.dto';
import { UpdateReasonDto } from './dto/update-reason.dto';
import { UpdateReasonResponseDto } from './dto/update-reason-response.dto';

@Injectable()
export class ReasonService {
  constructor(
    @InjectRepository(Reason)
    private readonly reasonRepository: Repository<Reason>,
  ) {}

  public async find(reasonId: number): Promise<FindReasonResponseDto> {
    const reason = await this.reasonRepository.findOneByOrFail({
      id: reasonId,
    });

    return FindReasonResponseDto.from(reason);
  }

  public async list({
    title,
  }: QueryReasonDto): Promise<ListReasonResponseDto[]> {
    const reasons = await this.reasonRepository.find({
      select: ['id', 'title'],
      where: { ...(title ? { title: Like(title) } : {}) },
    });

    return ListReasonResponseDto.from(reasons);
  }

  public async create(
    createReasonDto: CreateReasonDto,
  ): Promise<CreateReasonResponseDto> {
    const reason = await this.reasonRepository.save({ ...createReasonDto });

    return CreateReasonResponseDto.from(reason);
  }

  public async update(
    reasonId: number,
    updateReasonDto: UpdateReasonDto,
  ): Promise<UpdateReasonResponseDto> {
    await this.reasonRepository.update(
      { id: reasonId },
      { ...updateReasonDto },
    );

    const reason = await this.reasonRepository.findOneBy({ id: reasonId });

    return UpdateReasonResponseDto.from(reason);
  }

  public async delete(reasonId: number): Promise<boolean> {
    const { affected } = await this.reasonRepository.softDelete({
      id: reasonId,
    });

    return affected > 0;
  }
}
