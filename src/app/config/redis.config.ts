import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { registerConfig } from 'common/utils/register.config';
import 'dotenv/config';

export enum RedisConfigEnum {
    REDIS_HOST = 'REDIS_HOST',
    REDIS_PORT = 'REDIS_PORT',
    REDIS_PASSWORD = 'REDIS_PASSWORD',
}

export class RedisConfig {
    @IsString()
    @IsNotEmpty()
    host: string;

    @IsNumber()
    @IsNotEmpty()
    port: number;

    @IsString()
    @IsNotEmpty()
    password: string;

    constructor(obj: Partial<RedisConfig>) {
        Object.assign(this, obj);
    }
}

export const redisConfig = registerConfig(RedisConfig, () => {
    return new RedisConfig({
        host: process.env[RedisConfigEnum.REDIS_HOST],
        port: +process.env[RedisConfigEnum.REDIS_PORT],
        password: process.env[RedisConfigEnum.REDIS_PASSWORD],
    });
});
