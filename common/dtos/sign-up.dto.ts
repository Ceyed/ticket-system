import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRoleEnum } from 'common/enums/role.enum';

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @MinLength(8)
    password: string;

    @IsOptional()
    @IsEnum(UserRoleEnum)
    role?: UserRoleEnum;
}
