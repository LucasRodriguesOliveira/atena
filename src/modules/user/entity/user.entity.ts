import { UserType } from '../../../modules/user-type/entity/user-type.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 150 })
  password: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  token: string;

  @JoinColumn({
    name: 'userTypeId',
    foreignKeyConstraintName: 'User_UserType_fk',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => UserType, (userType) => userType.users)
  type: UserType;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
