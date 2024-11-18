import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'common/database/postgres/entities/user/user.entity';
import { UserRepository } from 'common/database/postgres/entities/user/user.repository';
import { AccessTokenGuard } from 'common/guards/access-token.guard';
import { RedisHelperModule } from 'common/modules/redis-helper/redis-helper.module';
import { appConfig } from 'src/app/config/app.config';
import { jwtConfig } from 'src/app/config/jwt.config';
import { RedisConfig, redisConfig } from 'src/app/config/redis.config';
import { AuthenticationNormalController } from './authentication.normal.controller';
import { AuthenticationPublicController } from './authentication.public.controller';
import { AuthenticationService } from './authentication.service';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage/refresh-token-ids.storage';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(appConfig),
        ConfigModule.forFeature(jwtConfig),
        RedisHelperModule,
    ],
    controllers: [AuthenticationPublicController, AuthenticationNormalController],
    providers: [
        {
            provide: HashingService,
            useClass: BcryptService,
        },
        {
            provide: redisConfig.KEY,
            useClass: RedisConfig,
        },
        AccessTokenGuard,
        RefreshTokenIdsStorage,
        AuthenticationService,
        UserRepository,
    ],
    exports: [AuthenticationService],
})
export class IamModule {}
