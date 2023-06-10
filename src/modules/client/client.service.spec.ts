import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from './entity/client.entity';
import { randomUUID } from 'crypto';
import { FindClientResponseDto } from './dto/find-client-response.dto';
import { ListClientResponseDto } from './dto/list-client-response.dto';
import { PaginatedResult } from '../../shared/paginated-result.interface';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateClientResponseDto } from './dto/create-client-response.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateClientResponseDto } from './dto/update-client-response.dto';

describe('ClientService', () => {
  let clientService: ClientService;
  const clientRepository = {
    findOneOrFail: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findOneByOrFail: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: getRepositoryToken(Client),
          useValue: clientRepository,
        },
      ],
    }).compile();

    clientService = moduleRef.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(clientService).toBeDefined();
  });

  describe('Find', () => {
    describe('Success', () => {
      const client: Client = {
        id: randomUUID(),
        name: 'test',
        email: 'test',
        contracts: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const expected = FindClientResponseDto.from(client);

      beforeEach(() => {
        clientRepository.findOneOrFail.mockResolvedValueOnce(client);
      });

      it('should find a client', async () => {
        const result = await clientService.find(client.id);

        expect(result).toStrictEqual(expected);
        expect(clientRepository.findOneOrFail).toHaveBeenCalled();
      });
    });
  });

  describe('List', () => {
    const client: Client = {
      id: randomUUID(),
      name: 'test',
      email: 'test',
      contracts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const expected: PaginatedResult<ListClientResponseDto> =
      ListClientResponseDto.from([client], 1);

    beforeEach(() => {
      clientRepository.findAndCount.mockResolvedValueOnce([[client], 1]);
    });

    it('should return a list of clients', async () => {
      const result = await clientService.list({ name: client.name });

      expect(result).toStrictEqual(expected);
      expect(clientRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('Create', () => {
    const client: Client = {
      id: randomUUID(),
      name: 'test',
      email: 'test',
      contracts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const createClientDto: CreateClientDto = {
      name: 'test',
      email: 'test',
    };

    const expected = CreateClientResponseDto.from(client);

    beforeEach(() => {
      clientRepository.save.mockResolvedValueOnce(client);
    });

    it('should create a client', async () => {
      const result = await clientService.create(createClientDto);

      expect(result).toStrictEqual(expected);
      expect(clientRepository.save).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const client: Client = {
      id: randomUUID(),
      name: 'test',
      email: 'test',
      contracts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    const updateClientDto: UpdateClientDto = {
      name: 'updated test',
    };

    const expected = UpdateClientResponseDto.from(client);

    beforeEach(() => {
      clientRepository.update.mockResolvedValueOnce({ affected: 1 });
      clientRepository.findOneByOrFail.mockResolvedValueOnce(client);
    });

    it('should update a client', async () => {
      const result = await clientService.update(client.id, updateClientDto);

      expect(result).toStrictEqual(expected);
      expect(clientRepository.update).toHaveBeenCalled();
      expect(clientRepository.findOneByOrFail).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    const clientId = randomUUID();

    beforeEach(() => {
      clientRepository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should delete a client', async () => {
      const result = await clientService.delete(clientId);

      expect(result).toBe(true);
      expect(clientRepository.softDelete).toHaveBeenCalled();
    });
  });
});
