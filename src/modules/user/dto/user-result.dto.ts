import { User } from '../entity/user.entity';

export interface UserResult {
  id: string;
  name: string;
  username: string;
  type: string;
}

export class UserResultDto {
  static from({ id, name, type, username }: User): UserResult {
    return {
      id,
      name,
      type: type.description,
      username,
    };
  }
}
