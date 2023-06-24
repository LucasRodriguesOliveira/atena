import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupportTicket } from './entity/support-ticket.entity';
import { Repository } from 'typeorm';
import { FindSupportTicketResponseDto } from './dto/find-support-ticket-response.dto';
import { QuerySupportTicketDto } from './dto/query-support-ticket.dto';
import { ListSupportTicketResponseDto } from './dto/list-support-ticket-response.dto';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { Client } from '../client/entity/client.entity';
import { User } from '../user/entity/user.entity';
import { CreateSupportTicketResponseDto } from './dto/create-support-ticket-response.dto';

@Injectable()
export class SupportTicketService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly supportTicketRepository: Repository<SupportTicket>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async find(
    supportTicketId: string,
  ): Promise<FindSupportTicketResponseDto> {
    const ticket = await this.supportTicketRepository.findOneOrFail({
      select: [
        'id',
        'client',
        'user',
        'reason',
        'details',
        'createdAt',
        'updatedAt',
      ],
      where: { id: supportTicketId },
      relations: {
        client: true,
        user: true,
      },
    });

    return FindSupportTicketResponseDto.from(ticket);
  }

  public async list({
    clientId,
    items = 10,
    page = 0,
    reason,
    userId,
  }: QuerySupportTicketDto): Promise<ListSupportTicketResponseDto> {
    const queryBuilder = await this.supportTicketRepository
      .createQueryBuilder('support_ticket')
      .select('support_ticket.id')
      .addSelect('support_ticket.reason')
      .addSelect('support_ticket.createdAt')
      .addSelect('client.id')
      .addSelect('client.name')
      .addSelect('user.id')
      .addSelect('user.name')
      .leftJoinAndSelect('support_ticket.client', 'client')
      .leftJoinAndSelect('support_ticket.user', 'user');

    if (clientId) {
      queryBuilder.andWhere('client.id = :clientId', { clientId });
    }

    if (userId) {
      queryBuilder.andWhere('user.id = :userId', { userId });
    }

    if (reason) {
      queryBuilder.andWhere('support_ticket.reason LIKE %:reason%', { reason });
    }

    const [tickets, total] = await queryBuilder
      .skip(page * items)
      .take(items)
      .getManyAndCount();

    return ListSupportTicketResponseDto.from(tickets, total);
  }

  public async create(
    createSupportTicketDto: CreateSupportTicketDto,
  ): Promise<CreateSupportTicketResponseDto> {
    const [client, user] = await Promise.all([
      this.clientRepository.findOneBy({ id: createSupportTicketDto.clientId }),
      this.userRepository.findOneBy({ id: createSupportTicketDto.userId }),
    ]);

    const ticket = await this.supportTicketRepository.save({
      ...createSupportTicketDto,
      client,
      user,
    });

    return CreateSupportTicketResponseDto.from(ticket);
  }

  public async delete(supportTicketId: string): Promise<boolean> {
    const { affected } = await this.supportTicketRepository.softDelete({
      id: supportTicketId,
    });

    return affected > 0;
  }
}
