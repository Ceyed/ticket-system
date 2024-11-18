import { IsString } from 'class-validator';

export class AccessTokenAndRefreshTokenDto {
    @IsString()
    accessToken: string;

    @IsString()
    refreshToken: string;
}
