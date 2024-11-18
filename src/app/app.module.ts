import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisHelperModule } from 'common/modules/redis-helper/redis-helper.module';
import { IamModule } from 'src/iam/iam.module';
import { MessageModule } from 'src/message/message.module';
import { DataSourceOptions } from 'typeorm';
import { appConfig } from './config/app.config';
import { jwtConfig } from './config/jwt.config';
import { redisConfig } from './config/redis.config';
import { typeormConfig } from './config/typeorm.config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, cache: true }),
        ConfigModule.forFeature(appConfig),
        ConfigModule.forFeature(redisConfig),
        ConfigModule.forFeature(typeormConfig),
        ConfigModule.forFeature(jwtConfig),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(typeormConfig), ConfigModule.forFeature(appConfig)],
            useFactory: (
                typeormConfigService: ConfigType<typeof typeormConfig>,
                appConfigService: ConfigType<typeof appConfig>,
            ) =>
                ({
                    schema: 'public',
                    type: typeormConfigService.type,
                    host: typeormConfigService.host,
                    port: typeormConfigService.port,
                    username: typeormConfigService.username,
                    password: typeormConfigService.password,
                    database: typeormConfigService.database,
                    synchronize: typeormConfigService.synchronize,
                    autoLoadEntities: true,
                    logging: 'all',
                    entities: typeormConfigService.entities,
                    migrationsTableName: 'migrations',
                }) as DataSourceOptions,
            inject: [typeormConfig.KEY, appConfig.KEY],
        }),
        RedisHelperModule,
        IamModule,
        MessageModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
