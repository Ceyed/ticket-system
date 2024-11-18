import { SetMetadata } from '@nestjs/common';
import { RouteTypeEnum } from 'common/enums/route-type.enum';

export const AUTH_TYPE_KEY = 'authType';

export const Auth = (...authTypes: RouteTypeEnum[]) => SetMetadata(AUTH_TYPE_KEY, authTypes);
