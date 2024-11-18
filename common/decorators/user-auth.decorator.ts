import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from 'common/constants/iam.constant';
import { ActiveUserDataInterface } from 'common/interface/active-user-data.interface';

export const User = createParamDecorator(
    (field: keyof ActiveUserDataInterface | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: ActiveUserDataInterface | undefined = request[REQUEST_USER_KEY];
        return field ? user?.[field] : user;
    },
);
