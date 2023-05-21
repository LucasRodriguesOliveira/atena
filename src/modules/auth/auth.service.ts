import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JWTService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JWTService,
  ) {}

  public async register(registerDto: RegisterDto): Promise<boolean> {
    const user: User = await this.userService.create(registerDto);

    // returns true to confirm that the creation was successfull

    return !!user;
  }

  public async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user: User = await this.userService.findByUsername(loginDto.username);

    if (user.password !== loginDto.password) {
      throw new HttpException(
        'username or password incorrect',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.createToken(user, loginDto.remember);
  }

  private async createToken(
    user: User,
    remember: boolean,
  ): Promise<LoginResponseDto> {
    if (remember) {
      const longTermToken = await this.jwtService.sign(user, '30d');
      user.token = longTermToken;

      await this.userService.updateToken(user.id, user.token);
    }

    const token = await this.jwtService.sign(user, '1d');

    return {
      token,
    };
  }
}
