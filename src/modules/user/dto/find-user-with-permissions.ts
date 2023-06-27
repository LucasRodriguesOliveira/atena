import { Module } from '../../module/entity/module.entity';
import { Permission } from '../../permission/entity/permission.entity';
import { PermissionGroup } from '../../permissionGroup/entity/permission-group.entity';
import { UserType } from '../../user-type/entity/user-type.entity';
import { User } from '../entity/user.entity';

class FindPermission {
  id: number;
  description: string;

  static from({ id, description }: Permission): FindPermission {
    return {
      id,
      description,
    };
  }
}

class FindModule {
  id: number;
  description: string;

  static from({ id, description }: Module): FindModule {
    return {
      id,
      description,
    };
  }
}

class FindPermissionGroups {
  id: number;
  permission: FindPermission;
  module: FindModule;

  static from({
    id,
    permission,
    module,
  }: PermissionGroup): FindPermissionGroups {
    return {
      id,
      permission: FindPermission.from(permission),
      module: FindModule.from(module),
    };
  }
}

class FindUserType {
  id: number;
  description: string;
  permissionGroups: FindPermissionGroups[];

  static from({ id, description, permissionGroups }: UserType): FindUserType {
    return {
      id,
      description,
      permissionGroups: permissionGroups.map(FindPermissionGroups.from),
    };
  }
}

export class FindUserWithPermissions {
  id: string;
  name: string;
  type: FindUserType;

  static from({ id, name, type }: User): FindUserWithPermissions {
    return {
      id,
      name,
      type,
    };
  }
}
