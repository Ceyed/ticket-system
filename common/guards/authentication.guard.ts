import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthType } from 'common/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'common/decorators/auth.decorator';
import { AccessTokenGuard } from './access-token.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    private static readonly defaultAuthType = AuthType.Bearer;

    private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]> = {
        [AuthType.Bearer]: this._accessToken,
        [AuthType.None]: { canActivate: () => true },
    };

    constructor(
        private readonly _reflector: Reflector,
        private readonly _accessToken: AccessTokenGuard,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const authTypes = this._reflector.getAllAndOverride<AuthType[]>(AUTH_TYPE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) ?? [AuthenticationGuard.defaultAuthType];

        const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

        let error = new UnauthorizedException();
        for (const instance of guards) {
            const canActivate = await Promise.resolve(instance.canActivate(context)).catch(
                (err) => {
                    error = err;
                },
            );

            if (canActivate) return true;
        }

        throw error;
    }
}
