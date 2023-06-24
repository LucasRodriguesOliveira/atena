import { randomBytes } from 'crypto';
import { AuthController } from '../../../src/modules/auth/auth.controller';
import { ClientController } from '../../../src/modules/client/client.controller';
import { CreateSupportTicketResponseDto } from '../../../src/modules/support-ticket/dto/create-support-ticket-response.dto';
import { CreateSupportTicketDto } from '../../../src/modules/support-ticket/dto/create-support-ticket.dto';
import { SupportTicketController } from '../../../src/modules/support-ticket/support-ticket.controller';
import { UserTypeEnum } from '../../../src/modules/user-type/type/user-type.enum';
import { User } from '../../../src/modules/user/entity/user.entity';
import { RepositoryManager } from '../repository';
import { createClient } from './create-client';
import { createUser } from './create-user';

interface CreateSupportTicketOptions {
  supportTicketController: SupportTicketController;
  clientController: ClientController;
  authController: AuthController;
  repositoryManager: RepositoryManager;
}

export async function createSupportTicket({
  authController,
  clientController,
  supportTicketController,
  repositoryManager,
}: CreateSupportTicketOptions): Promise<CreateSupportTicketResponseDto> {
  const [client, username] = await Promise.all([
    createClient({ clientController }),
    createUser({
      authController,
      userType: UserTypeEnum.DEFAULT,
      override: true,
      testName: 'create-ticket',
    }),
  ]);

  const { id: userId } = await repositoryManager.find<User>(User.name, {
    username,
  });

  const createSupportTicketDto: CreateSupportTicketDto = {
    clientId: client.id,
    details: randomBytes(20).toString('hex'),
    reason: randomBytes(10).toString('hex'),
    userId,
  };

  return supportTicketController.create(createSupportTicketDto);
}
