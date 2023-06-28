import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { FindUserWithPermissions } from '../../user/dto/find-user-with-permissions';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: FindUserWithPermissions = request.user;
    const requiredType = this.reflector.get<string[]>(
      'type',
      context.getHandler(),
    );

    if (requiredType?.length) {
      return requiredType.includes(user.type.description);
    }

    const module = this.reflector.get<string>('module', context.getClass());
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    const {
      type: { permissionGroups },
    } = user;

    if (permissionGroups.length === 0) {
      return false;
    }

    const permissionsByModule = permissionGroups
      .filter(
        (permissionGroup) => permissionGroup.module.description === module,
      )
      .map(({ permission }) => permission.description);

    if (!permissionsByModule.length) {
      return false;
    }

    if (
      permissions.every((accessPermission) =>
        permissionsByModule.includes(accessPermission),
      )
    ) {
      return true;
    }

    return false;
  }
}
