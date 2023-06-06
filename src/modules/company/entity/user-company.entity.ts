import { Company } from './company.entity';
import { User } from '../../user/entity/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserCompany {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @JoinColumn({
    name: 'companyId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'UserCompany_Company_fk',
  })
  @ManyToOne(() => Company, (company) => company.userCompanies)
  company: Company;

  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'UserCompany_User_fk',
  })
  @ManyToOne(() => User, (user) => user.userCompanies)
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
