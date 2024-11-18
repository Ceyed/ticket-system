import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from 'common/constants/iam.constant';
import { UserRoleEnum } from 'common/enums/role.enum';
import { ActiveUserDataInterface } from 'common/interface/active-user-data.interface';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly _reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const contextRoles = this._reflector.getAllAndOverride<UserRoleEnum[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log(contextRoles);
        if (!contextRoles) {
            return true;
        }

        const activeUser: ActiveUserDataInterface = context.switchToHttp().getRequest()[
            REQUEST_USER_KEY
        ];
        return contextRoles.some((role) => activeUser.role === role);
    }
}
