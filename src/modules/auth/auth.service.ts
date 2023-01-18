import { Injectable } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async register(registerDto: RegisterDto): Promise<string> {
    const user: User = await this.userService.create(registerDto);
    const token = user.name;

    return token;
  }
}
