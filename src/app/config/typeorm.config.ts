import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { registerConfig } from 'common/utils/register.config';
import 'dotenv/config';

enum TypeormConfigEnum {
    TYPEORM_DB_TYPE = 'postgres',
    TYPEORM_HOST = 'POSTGRES_HOST',
    TYPEORM_PORT = 'POSTGRES_PORT',
    TYPEORM_DATABASE = 'POSTGRES_DB',
    TYPEORM_USERNAME = 'POSTGRES_USER',
    TYPEORM_PASSWORD = 'POSTGRES_PASSWORD',
}

export class TypeormConfig {
    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    host: string;

    @IsNumber()
    port = 5432;

    @IsString()
    @IsNotEmpty()
    database: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsBoolean()
    synchronize: boolean = false;

    @IsArray()
    entities = ['dist/**/*.entity{.ts,.js}'];

    constructor(obj: Partial<TypeormConfig>) {
        Object.assign(this, obj);
    }
}

export const typeormConfig = registerConfig(TypeormConfig, () => {
    const port = process.env[TypeormConfigEnum.TYPEORM_PORT];
    return new TypeormConfig({
        type: TypeormConfigEnum.TYPEORM_DB_TYPE,
        host: process.env[TypeormConfigEnum.TYPEORM_HOST],
        database: process.env[TypeormConfigEnum.TYPEORM_DATABASE],
        username: process.env[TypeormConfigEnum.TYPEORM_USERNAME],
        password: process.env[TypeormConfigEnum.TYPEORM_PASSWORD],
        port: port ? +port : undefined,
        synchronize: false,
    });
});
