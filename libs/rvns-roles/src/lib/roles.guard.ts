import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

const ROLES_INHERITANCE: Record<RoleEnum, RoleEnum[]> = {
  [RoleEnum.SuperAdmin]: [],
  [RoleEnum.User]: [RoleEnum.User],
};

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const user = context.switchToHttp().getRequest().user;
    const userRoles = this.prepareUserRoles(user.roles);
    return requiredRoles.some((role) => userRoles.includes(role));
  }

  protected prepareUserRoles(roles: RoleEnum[]): RoleEnum[] {
    const outRoles = [];
    if (roles === undefined) {
      return outRoles;
    }
    for (const role of roles) {
      outRoles.push(role, ...ROLES_INHERITANCE[role]);
    }
    return outRoles;
  }
}
