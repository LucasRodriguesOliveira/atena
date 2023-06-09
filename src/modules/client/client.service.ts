import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entity/client.entity';
import { Like, Repository } from 'typeorm';
import { FindClientResponseDto } from './dto/find-client-response.dto';
import { PaginatedResult } from '../../shared/paginated-result.interface';
import { QueryClientDto } from './dto/query-client.dto';
import { ListClientResponseDto } from './dto/list-client-response.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateClientResponseDto } from './dto/create-client-response.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateClientResponseDto } from './dto/update-client-response.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  public async find(clientId: string): Promise<FindClientResponseDto> {
    const client = await this.clientRepository.findOneOrFail({
      select: ['id', 'name', 'email', 'createdAt'],
      where: {
        id: clientId,
      },
    });

    return FindClientResponseDto.from(client);
  }

  public async list({
    name,
  }: QueryClientDto): Promise<PaginatedResult<ListClientResponseDto>> {
    const [clients, count] = await this.clientRepository.findAndCount({
      select: ['id', 'name'],
      where: {
        ...(name ? { name: Like(name) } : {}),
      },
    });

    return ListClientResponseDto.from(clients, count);
  }

  public async create(
    createClientDto: CreateClientDto,
  ): Promise<CreateClientResponseDto> {
    const client = await this.clientRepository.save(createClientDto);

    return CreateClientResponseDto.from(client);
  }

  public async update(
    clientId: string,
    { name }: UpdateClientDto,
  ): Promise<UpdateClientResponseDto> {
    await this.clientRepository.update({ id: clientId }, { name });

    const client = await this.clientRepository.findOneByOrFail({
      id: clientId,
    });

    return UpdateClientResponseDto.from(client);
  }

  public async delete(clientId: string): Promise<boolean> {
    const { affected } = await this.clientRepository.softDelete({
      id: clientId,
    });

    return affected > 0;
  }
}
