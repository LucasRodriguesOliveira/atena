import { createParamDecorator } from '@nestjs/common';
import {
  UserResultDto,
  UserResult,
} from '../../../modules/user/dto/user-result.dto';

export const GetUser = createParamDecorator((data, req): UserResult => {
  return UserResultDto.from(req.args[0].user);
});
