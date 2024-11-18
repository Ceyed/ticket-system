import { Controller, UseGuards, applyDecorators } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { UserRoleEnum } from 'common/enums/role.enum';
import { RouteTypeEnum } from 'common/enums/route-type.enum';
import { AuthenticationGuard } from 'common/guards/authentication.guard';
import { RoleGuard } from 'common/guards/roles.guard';
import { Role } from './roles.decorator';

export function AppController(
    controllerPath: string,
    routeType: RouteTypeEnum = RouteTypeEnum.User,
) {
    const [decorators, guards] = _getDecoratorAndGuards(controllerPath, routeType);
    if (routeType !== RouteTypeEnum.Public) {
        decorators.push(UseGuards(...guards));
    }

    return applyDecorators(...decorators);
}

function _getDecoratorAndGuards(
    controllerPath: string,
    routeType = RouteTypeEnum.User,
): [Array<ClassDecorator | MethodDecorator | PropertyDecorator>, ClassConstructor<any>[]] {
    const guards = [];
    const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [];

    const path: string = _getPathPrefix(routeType) + controllerPath;

    if (routeType !== RouteTypeEnum.Public) {
        guards.push(AuthenticationGuard, RoleGuard);
        decorators.push(Role(routeType as unknown as UserRoleEnum));
    }

    decorators.push(Controller(path));
    return [decorators, guards];
}

function _getPathPrefix(routeType: RouteTypeEnum): string {
    switch (routeType) {
        case RouteTypeEnum.Admin:
            return 'admin/';
        case RouteTypeEnum.User:
            return 'user/';
        case RouteTypeEnum.Employee:
            return 'employee/';
        case RouteTypeEnum.Public:
        default:
            return 'public/';
    }
}
