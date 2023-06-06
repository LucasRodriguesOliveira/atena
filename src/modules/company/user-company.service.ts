import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCompany } from './entity/user-company.entity';
import { Repository } from 'typeorm';
import { FindUsersDto } from './dto/find-users.dto';

@Injectable()
export class UserCompanyService {
  constructor(
    @InjectRepository(UserCompany)
    private readonly userCompanyRepository: Repository<UserCompany>,
  ) {}

  public async findUsers(companyId: string): Promise<FindUsersDto[]> {
    const userCompanyList = await this.userCompanyRepository.find({
      select: {
        user: {
          id: true,
          name: true,
          type: { description: true },
        },
      },
      relations: ['user', 'user.type'],
      where: {
        company: {
          id: companyId,
        },
      },
    });

    return FindUsersDto.from(userCompanyList);
  }

  public async delete(userCompanyId: number): Promise<boolean> {
    const { affected } = await this.userCompanyRepository.delete({
      id: userCompanyId,
    });

    return affected > 0;
  }
}
