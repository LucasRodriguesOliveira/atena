import { BlackListController } from '../../../src/modules/black-list/item/black-list.controller';
import { CreateBlackListResponseDto } from '../../../src/modules/black-list/item/dto/create-black-list-response.dto';
import { CreateBlackListDto } from '../../../src/modules/black-list/item/dto/create-black-list.dto';
import { ReasonController } from '../../../src/modules/black-list/reason/reason.controller';
import { ClientController } from '../../../src/modules/client/client.controller';
import { createBlackListReason } from './create-black-list-reason';
import { createClient } from './create-client';

interface CreateBlackListOptions {
  reasonController: ReasonController;
  clientController: ClientController;
  blackListController: BlackListController;
}

export async function createBlackList({
  blackListController,
  clientController,
  reasonController,
}: CreateBlackListOptions): Promise<CreateBlackListResponseDto> {
  const [client, reason] = await Promise.all([
    createClient({ clientController }),
    createBlackListReason({ reasonController }),
  ]);

  const createBlackListDto: CreateBlackListDto = {
    clientId: client.id,
    reasonId: reason.id,
  };

  return blackListController.create(createBlackListDto);
}
