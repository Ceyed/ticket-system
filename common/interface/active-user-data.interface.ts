import { UserRoleEnum } from 'common/enums/role.enum';

export interface ActiveUserDataInterface {
    sub: string;
    username: string;
    role: UserRoleEnum;
}
