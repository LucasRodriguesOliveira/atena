import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTConfig } from '../../config/env/jwt.config';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { FindUserWithPermissions } from '../user/dto/find-user-with-permissions';

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

  async validate(payload: { id: string }): Promise<FindUserWithPermissions> {
    const { id } = payload;
    let user: FindUserWithPermissions;

    try {
      user = await this.userService.findWithPermissions(id);
    } catch (err) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async sign(user: User, expiresIn: string): Promise<string> {
    return this.jwtService.sign({ id: user.id }, { expiresIn });
  }
}
