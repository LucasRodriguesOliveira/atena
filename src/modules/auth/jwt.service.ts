import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTConfig } from '../../config/env/jwt.config';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { FindUserDto } from '../user/dto/find-user.dto';

@Injectable()
export class JWTService extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<JWTConfig>('jwt').secret,
    });
  }

  async validate(payload: { id: string }): Promise<FindUserDto> {
    const { id } = payload;
    const user = await this.userService.find(id);

    if (!user?.id) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async sign(user: User, expiresIn: string): Promise<string> {
    return this.jwtService.sign({ id: user.id }, { expiresIn });
  }
}
