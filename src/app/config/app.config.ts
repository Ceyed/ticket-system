import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { registerConfig } from 'common/utils/register.config';
import 'dotenv/config';

export enum AppConfigEnum {
    HOST = 'HOST',
    PORT = 'PORT',
}

export class AppConfig {
    @IsString()
    @IsNotEmpty()
    host: string;

    @IsNumber()
    port: number = 4213;

    constructor(obj: Partial<AppConfig>) {
        Object.assign(this, obj);
    }
}

export const appConfig = registerConfig(AppConfig, () => {
    return new AppConfig({
        host: process.env[AppConfigEnum.HOST],
        port: +process.env[AppConfigEnum.PORT],
    });
});
