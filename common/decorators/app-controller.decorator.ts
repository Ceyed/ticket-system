import { Controller, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';
import { ClassConstructor } from 'class-transformer';
import { AppModulesEnum } from 'common/enums/app-modules.enum';
import { RouteTypeEnum } from 'common/enums/route-type.enum';
import { AuthenticationGuard } from 'common/guards/authentication.guard';
import { RoleGuard } from 'common/guards/roles.guard';

export function AppController(
    module: AppModulesEnum,
    controllerPath: string,
    routeType: RouteTypeEnum = RouteTypeEnum.NORMAL,
) {
    const [decorators, guards] = _getDecoratorAndGuards(module, controllerPath, routeType);
    if (routeType !== RouteTypeEnum.PUBLIC) {
        decorators.push(UseGuards(...guards));
    }

    return applyDecorators(...decorators);
}

function _getDecoratorAndGuards(
    module: SwaggerEnumType,
    controllerPath: string,
    routeType = RouteTypeEnum.NORMAL,
): [Array<ClassDecorator | MethodDecorator | PropertyDecorator>, ClassConstructor<any>[]] {
    const guards = [];
    const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
        // SetMetadata(MODULE_CUSTOM_METADATA, module),
        ApiTags(module as string),
    ];

    const path: string = _getPathPrefix(routeType) + controllerPath;

    if (routeType !== RouteTypeEnum.PUBLIC) {
        guards.push(AuthenticationGuard, RoleGuard);
        decorators.push(ApiBearerAuth());
    }

    decorators.push(
        // SetMetadata(ROUTE_TYPE_METADATA, routeType),
        Controller(path),
    );
    return [decorators, guards];
}

function _getPathPrefix(routeType: RouteTypeEnum): string {
    switch (routeType) {
        case RouteTypeEnum.ADMIN:
            return 'admin/';
        case RouteTypeEnum.NORMAL:
            return 'normal/';
        default:
            return 'public/';
    }
}
