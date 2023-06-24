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
import { ClientController } from './client.controller';

describe('ClientController', () => {
  let clientController: ClientController;
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
      controllers: [ClientController],
      providers: [
        ClientService,
        {
          provide: getRepositoryToken(Client),
          useValue: clientRepository,
        },
      ],
    }).compile();

    clientController = moduleRef.get<ClientController>(ClientController);
  });

  it('should be defined', () => {
    expect(clientController).toBeDefined();
  });

  describe('Find', () => {
    describe('Success', () => {
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

      const expected = FindClientResponseDto.from(client);

      beforeEach(() => {
        clientRepository.findOneOrFail.mockResolvedValueOnce(client);
      });

      it('should find a client', async () => {
        const result = await clientController.find(client.id);

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
      costumerServices: [],
      tickets: [],
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
      const result = await clientController.list({ name: client.name });

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
      costumerServices: [],
      tickets: [],
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
      const result = await clientController.create(createClientDto);

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
      costumerServices: [],
      tickets: [],
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
      const result = await clientController.update(client.id, updateClientDto);

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
      const result = await clientController.delete(clientId);

      expect(result).toBe(true);
      expect(clientRepository.softDelete).toHaveBeenCalled();
    });
  });
});
