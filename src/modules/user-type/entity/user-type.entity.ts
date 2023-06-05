import { PermissionGroup } from '../../permissionGroup/entity/permission-group.entity';
import { User } from '../../../modules/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserType {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  description: string;

  @OneToMany(() => User, (user) => user.type)
  users: User[];

  @OneToMany(
    () => PermissionGroup,
    (permissionGroup) => permissionGroup.userType,
  )
  permissionGroups: PermissionGroup[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
