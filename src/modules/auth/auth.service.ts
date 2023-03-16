import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  public async register(registerDto: RegisterDto): Promise<boolean> {
    const user: User = await this.userService.create(registerDto);

    return !!user;
  }

  public async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user: User = await this.userService.findByUsername(loginDto.username);

    if (!(user.password !== loginDto.password)) {
      throw new HttpException(
        'username or password incorrect',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.tokenService.createLoginToken(user, loginDto.remember);
  }
}
