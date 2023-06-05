import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { UserType } from './entity/user-type.entity';
import { FindUserTypeDto } from './dto/find-user-type.dto';
import { ListUserTypeResponse } from './dto/list-user-type-response.dto';
import { CreateUserTypeResponse } from './dto/create-user-type-response.dto';
import { UpdateUserTypeResponse } from './dto/update-user-type-response.dto';

@Injectable()
export class UserTypeService {
  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
  ) {}

  public async list(): Promise<ListUserTypeResponse[]> {
    const userTypeList = await this.userTypeRepository.find({
      select: ['id', 'description'],
    });

    return userTypeList.map((userType) => ListUserTypeResponse.from(userType));
  }

  public async find(userTypeId: number): Promise<FindUserTypeDto | null> {
    const userType = await this.userTypeRepository.findOneBy({
      id: userTypeId,
    });

    if (!userType?.id) {
      return null;
    }

    return FindUserTypeDto.from(userType);
  }

  public async create(
    createUserTypeDto: CreateUserTypeDto,
  ): Promise<CreateUserTypeResponse> {
    const userType = await this.userTypeRepository.save(createUserTypeDto);

    return CreateUserTypeResponse.from(userType);
  }

  public async update(
    userTypeId: number,
    updateUserTypeDto: UpdateUserTypeDto,
  ): Promise<UpdateUserTypeResponse> {
    await this.userTypeRepository.update({ id: userTypeId }, updateUserTypeDto);
    const userType = await this.userTypeRepository.findOneBy({
      id: userTypeId,
    });

    return UpdateUserTypeResponse.from(userType);
  }

  public async delete(userTypeId: number): Promise<boolean> {
    const { affected } = await this.userTypeRepository.softDelete({
      id: userTypeId,
    });

    return affected > 0;
  }
}
