import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userType = request.user.type;
    const requiredType = this.reflector.get<string>(
      'type',
      context.getHandler(),
    );

    if (!requiredType) {
      return true;
    }

    return userType === requiredType;
  }
}
