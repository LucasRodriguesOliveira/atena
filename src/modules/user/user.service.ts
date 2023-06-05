import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTypeService } from '../user-type/user-type.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly userTypeService: UserTypeService,
  ) {}

  public async list(queryUserDto: QueryUserDto): Promise<User[]> {
    let query = {};

    if (queryUserDto.name) {
      query = {
        name: queryUserDto.name,
      };
    }

    if (queryUserDto.username) {
      query = {
        username: queryUserDto.username,
      };
    }

    return this.userRepository.find({
      select: {
        id: true,
        name: true,
        type: {
          description: true,
        },
      },
      relations: {
        type: true,
      },
      where: {
        ...query,
      },
    });
  }

  public async find(userId: string): Promise<FindUserDto | null> {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        name: true,
        username: true,
        type: {
          description: true,
        },
      },
      relations: {
        type: true,
      },
      where: {
        id: userId,
      },
    });

    if (!user?.id) {
      return null;
    }

    return FindUserDto.from(user);
  }

  public async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      select: {
        id: true,
        username: true,
        password: true,
        type: {
          description: true,
        },
      },
      relations: {
        type: true,
      },
      where: {
        username,
      },
    });
  }

  public async create({
    name,
    password,
    userTypeId,
    username,
  }: CreateUserDto): Promise<User> {
    const userType = await this.userTypeService.find(userTypeId);

    return this.userRepository.save({
      name,
      password,
      username,
      type: userType,
    });
  }

  public async update(
    userId: string,
    { name, password, userTypeId, username }: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    const userType = await this.userTypeService.find(userTypeId);
    await this.userRepository.update(
      { id: userId },
      { name, password, username, type: userType },
    );

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        type: true,
      },
    });

    return UpdateUserResponseDto.from(user);
  }

  public async updateToken(
    userId: string,
    token: string,
  ): Promise<UpdateUserResponseDto> {
    await this.userRepository.update({ id: userId }, { token });

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        type: true,
      },
    });

    return UpdateUserResponseDto.from(user);
  }

  public async delete(userId: string): Promise<boolean> {
    const { affected } = await this.userRepository.softDelete({ id: userId });

    return affected > 0;
  }

  public async hashPassword(password: string, salt?: string): Promise<string> {
    if (!salt) {
      salt = await bcrypt.genSalt();
    }

    return bcrypt.hash(password, salt);
  }

  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
