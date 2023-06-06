import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCompany } from './entity/user-company.entity';
import { Repository } from 'typeorm';
import { FindUsersDto } from './dto/find-users.dto';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { CreateUserCompanyResponseDto } from './dto/create-user-company-response.dto';
import { Company } from './entity/company.entity';
import { User } from '../user/entity/user.entity';

@Injectable()
export class UserCompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

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

  public async attachUser(
    companyId: string,
    { userId }: CreateUserCompanyDto,
  ): Promise<CreateUserCompanyResponseDto> {
    const [company, user] = await Promise.all([
      this.companyRepository.findOneBy({ id: companyId }),
      this.userRepository.findOneBy({ id: userId }),
    ]);

    const userCompany = await this.userCompanyRepository.save({
      company,
      user,
    });

    return CreateUserCompanyResponseDto.from(userCompany);
  }

  public async deattachUser(userCompanyId: number): Promise<boolean> {
    const { affected } = await this.userCompanyRepository.delete({
      id: userCompanyId,
    });

    return affected > 0;
  }
}
