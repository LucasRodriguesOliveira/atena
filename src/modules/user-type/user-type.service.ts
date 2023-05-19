import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { UserType } from './entity/user-type.entity';

@Injectable()
export class UserTypeService {
  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
  ) {}

  public async list(): Promise<UserType[]> {
    return this.userTypeRepository.find({
      select: ['id', 'description'],
    });
  }

  public async find(userTypeId: number): Promise<UserType> {
    return this.userTypeRepository.findOneBy({ id: userTypeId });
  }

  public async create(createUserTypeDto: CreateUserTypeDto): Promise<UserType> {
    return this.userTypeRepository.save(createUserTypeDto);
  }

  public async update(
    userTypeId: number,
    updateUserTypeDto: UpdateUserTypeDto,
  ): Promise<UserType> {
    await this.userTypeRepository.update({ id: userTypeId }, updateUserTypeDto);

    return this.userTypeRepository.findOneBy({ id: userTypeId });
  }

  public async delete(userTypeId: number): Promise<boolean> {
    const { affected } = await this.userTypeRepository.softDelete({
      id: userTypeId,
    });

    return affected > 0;
  }
}
