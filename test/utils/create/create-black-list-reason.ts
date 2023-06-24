import { randomBytes } from 'crypto';
import { CreateReasonDto } from '../../../src/modules/black-list/reason/dto/create-reason.dto';
import { ReasonController } from '../../../src/modules/black-list/reason/reason.controller';
import { CreateReasonResponseDto } from '../../../src/modules/black-list/reason/dto/create-reason-response.dto';

interface CreateBlackListReasonOptions {
  reasonController: ReasonController;
}

export async function createBlackListReason({
  reasonController,
}: CreateBlackListReasonOptions): Promise<CreateReasonResponseDto> {
  const createBlackListReasonDto: CreateReasonDto = {
    title: randomBytes(10).toString('hex'),
    details: randomBytes(100).toString('hex'),
  };

  return reasonController.create(createBlackListReasonDto);
}
