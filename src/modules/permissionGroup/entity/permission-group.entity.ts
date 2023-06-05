import { Module } from '../../module/entity/module.entity';
import { Permission } from '../../permission/entity/permission.entity';
import { UserType } from '../../user-type/entity/user-type.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PermissionGroup {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @JoinColumn({
    name: 'userTypeId',
    foreignKeyConstraintName: 'PermissionGroup_UserType_fk',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => UserType, (userType) => userType.permissionGroups)
  userType: UserType;

  @JoinColumn({
    name: 'permissionId',
    foreignKeyConstraintName: 'PermissionGroup_Permission_fk',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Permission, (permission) => permission.permissionGroups)
  permission: Permission;

  @JoinColumn({
    name: 'moduleId',
    foreignKeyConstraintName: 'PermissionGroup_Module_fk',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Module, (module) => module.permissionGroups)
  module: Module;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
