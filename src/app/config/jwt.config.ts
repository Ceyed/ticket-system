import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { registerConfig } from 'common/utils/register.config';
import 'dotenv/config';

enum JWT_CONFIG {
    JWT_SECRET = 'JWT_SECRET',
    JWT_TOKEN_AUDIENCE = 'JWT_TOKEN_AUDIENCE',
    JWT_TOKEN_ISSUER = 'JWT_TOKEN_ISSUER',
    JWT_ACCESS_TOKEN_TTL = 'JWT_ACCESS_TOKEN_TTL',
    JWT_REFRESH_TOKEN_TTL = 'JWT_REFRESH_TOKEN_TTL',
    PEPPER = 'PEPPER',
}

export class JwtConfig {
    @IsString()
    @IsNotEmpty()
    secret: string;

    @IsString()
    @IsNotEmpty()
    audience: string;

    @IsString()
    @IsNotEmpty()
    issuer: string;

    @IsNumber()
    accessTokenTtl: number;

    @IsNumber()
    refreshTokenTtl: number;

    @IsString()
    @IsNotEmpty()
    pepper: string;

    constructor(obj: Partial<JwtConfig>) {
        Object.assign(this, obj);
    }
}

export const jwtConfig = registerConfig(JwtConfig, () => {
    return new JwtConfig({
        secret: process.env[JWT_CONFIG.JWT_SECRET],
        audience: process.env[JWT_CONFIG.JWT_TOKEN_AUDIENCE],
        issuer: process.env[JWT_CONFIG.JWT_TOKEN_ISSUER],
        accessTokenTtl: parseInt(process.env[JWT_CONFIG.JWT_ACCESS_TOKEN_TTL] ?? '3600', 10),
        refreshTokenTtl: parseInt(process.env[JWT_CONFIG.JWT_REFRESH_TOKEN_TTL] ?? '86400', 10),
        pepper: process.env[JWT_CONFIG.PEPPER],
    });
});
