import { User } from '../../../src/modules/user/entity/user.entity';
import { Repository } from 'typeorm';
import { repository } from '../repository';

interface RemoveUserOptions {
  username: string;
}

export async function removeUser({
  username,
}: RemoveUserOptions): Promise<boolean> {
  const userRepository = repository.get(User.name) as Repository<User>;
  const { affected } = await userRepository.delete({ username });

  return affected > 0;
}
