import { SupportTicketService } from './support-ticket.service';
import { SupportTicket } from './entity/support-ticket.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindSupportTicketResponseDto } from './dto/find-support-ticket-response.dto';
import { ListSupportTicketResponseDto } from './dto/list-support-ticket-response.dto';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { CreateSupportTicketResponseDto } from './dto/create-support-ticket-response.dto';
import { QuerySupportTicketDto } from './dto/query-support-ticket.dto';
import { randomUUID } from 'crypto';
import { Client } from '../client/entity/client.entity';
import { User } from '../user/entity/user.entity';
import { UserType } from '../user-type/entity/user-type.entity';
import { SupportTicketController } from './support-ticket.controller';

describe('SupportTicketController', () => {
  let controller: SupportTicketController;

  const getManyAndCount = jest.fn();
  const ticketRepository = {
    findOneOrFail: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getManyAndCount,
    })),
    save: jest.fn(),
    softDelete: jest.fn(),
  };
  const clientRepository = {
    findOneBy: jest.fn(),
  };
  const userRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [SupportTicketController],
      providers: [
        SupportTicketService,
        {
          provide: getRepositoryToken(SupportTicket),
          useValue: ticketRepository,
        },
        {
          provide: getRepositoryToken(Client),
          useValue: clientRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    controller = moduleRef.get<SupportTicketController>(
      SupportTicketController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const client: Client = {
    id: randomUUID(),
    name: 'test',
    email: 'test',
    contracts: [],
    costumerServices: [],
    tickets: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  const userType: UserType = {
    id: 1,
    description: 'test',
    permissionGroups: [],
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  const user: User = {
    id: randomUUID(),
    name: 'test',
    password: 'test',
    username: 'test',
    token: '',
    type: userType,
    costumerServices: [],
    tickets: [],
    userCompanies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  const ticket: SupportTicket = {
    id: randomUUID(),
    reason: 'test',
    details: '',
    client,
    user,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  describe('Find', () => {
    const expected = FindSupportTicketResponseDto.from(ticket);

    beforeAll(() => {
      ticketRepository.findOneOrFail.mockResolvedValueOnce(ticket);
    });

    it('should find a ticket by id', async () => {
      const result = await controller.find(ticket.id);

      expect(ticketRepository.findOneOrFail).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('List', () => {
    const expected = ListSupportTicketResponseDto.from([ticket], 1);
    const querySupportTicketDto: QuerySupportTicketDto = {
      clientId: ticket.client.id,
      userId: ticket.user.id,
      reason: ticket.reason,
    };

    beforeAll(() => {
      getManyAndCount.mockResolvedValueOnce([[ticket], 1]);
    });

    it('should return a list of tickets', async () => {
      const result = await controller.list(querySupportTicketDto);

      expect(result).toStrictEqual(expected);
      expect(getManyAndCount).toHaveBeenCalled();
    });
  });

  describe('Create', () => {
    const createSupportTicketDto: CreateSupportTicketDto = {
      clientId: ticket.client.id,
      userId: ticket.user.id,
      reason: ticket.reason,
      details: ticket.details,
    };
    const expected = CreateSupportTicketResponseDto.from(ticket);

    beforeAll(() => {
      ticketRepository.save.mockResolvedValueOnce(ticket);
      clientRepository.findOneBy.mockResolvedValueOnce(client);
      userRepository.findOneBy.mockResolvedValueOnce(user);
    });

    it('should create a ticket', async () => {
      const result = await controller.create(createSupportTicketDto);

      expect(result).toStrictEqual(expected);
      expect(ticketRepository.save).toHaveBeenCalled();
      expect(clientRepository.findOneBy).toHaveBeenCalled();
      expect(userRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    const ticketId = randomUUID();

    beforeAll(() => {
      ticketRepository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should soft delete a ticket', async () => {
      const result = await controller.delete(ticketId);

      expect(ticketRepository.softDelete).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
