import { Permission } from '../../../src/modules/permission/entity/permission.entity';
import { Module } from '../../../src/modules/module/entity/module.entity';
import { UserType } from '../../../src/modules/user-type/entity/user-type.entity';
import { User } from '../../../src/modules/user/entity/user.entity';
import { PermissionGroup } from '../../../src/modules/permissionGroup/entity/permission-group.entity';
import { Repository } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

type RepositoryEntity =
  | Repository<Module>
  | Repository<Permission>
  | Repository<UserType>
  | Repository<User>
  | Repository<PermissionGroup>;

export const repository = new Map<string, RepositoryEntity>();

interface AddRepositoryOption {
  testingModule: TestingModule;
  name: string | string[];
}

interface RepositoryItem {
  testingModule: TestingModule;
  name: string;
}

function addItem({ testingModule, name }: RepositoryItem) {
  let item: RepositoryEntity;

  if (name === Module.name) {
    item = testingModule.get<Repository<Module>>(getRepositoryToken(Module));
  }

  if (name === Permission.name) {
    item = testingModule.get<Repository<Permission>>(
      getRepositoryToken(Permission),
    );
  }

  if (name === User.name) {
    item = testingModule.get<Repository<User>>(getRepositoryToken(User));
  }

  if (name === UserType.name) {
    item = testingModule.get<Repository<UserType>>(
      getRepositoryToken(UserType),
    );
  }

  if (name === PermissionGroup.name) {
    item = testingModule.get<Repository<PermissionGroup>>(
      getRepositoryToken(PermissionGroup),
    );
  }

  repository.set(name, item);
}

export function addRepository({ testingModule, name }: AddRepositoryOption) {
  if (!Array.isArray(name)) {
    addItem({ testingModule, name });
  }

  if (Array.isArray(name)) {
    name.forEach((entityName) => {
      addItem({ testingModule, name: entityName });
    });
  }
}