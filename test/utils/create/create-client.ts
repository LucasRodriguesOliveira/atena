import { ClientController } from '../../../src/modules/client/client.controller';
import { CreateClientResponseDto } from '../../../src/modules/client/dto/create-client-response.dto';
import { CreateClientDto } from '../../../src/modules/client/dto/create-client.dto';

interface CreateClientOptions {
  clientController: ClientController;
}

export async function createClient({
  clientController,
}: CreateClientOptions): Promise<CreateClientResponseDto> {
  const createClientDto: CreateClientDto = {
    name: 'test',
    email: 'test@test.com',
  };

  return clientController.create(createClientDto);
}
