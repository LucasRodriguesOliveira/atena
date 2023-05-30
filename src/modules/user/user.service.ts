import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from '../user-type/entity/user-type.entity';
import { UserTypeService } from '../user-type/user-type.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

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

  public async find(userId: string): Promise<User> {
    return this.userRepository.findOne({
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
  }

  public async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
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
    const userType: UserType = await this.userTypeService.find(userTypeId);

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
  ): Promise<User> {
    const userType: UserType = await this.userTypeService.find(userTypeId);
    await this.userRepository.update(
      { id: userId },
      { name, password, username, type: userType },
    );

    return this.userRepository.findOneBy({ id: userId });
  }

  public async updateToken(userId: string, token: string): Promise<User> {
    await this.userRepository.update({ id: userId }, { token });

    return this.userRepository.findOneBy({ id: userId });
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
}
