import 'dotenv/config';
import * as path from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    host: process.env.POSTGRES_HOST,
    port: parseInt(`${process.env.POSTGRES_PORT || 3306}`),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    logging: false,
    migrations: [`${path.join(__dirname, './')}migrations/*.{ts,js}`],
    entities: [`${path.join(__dirname, './')}entities/**/*.entity.{ts,js}`],
    migrationsTableName: 'migrations',
});
