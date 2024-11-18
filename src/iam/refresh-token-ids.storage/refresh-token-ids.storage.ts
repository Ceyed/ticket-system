import { Inject, Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { uuid } from 'common/types/uuid.constant';
import Redis from 'ioredis';
import { RedisConfig, redisConfig } from 'src/app/config/redis.config';
import { InvalidatedRefreshTokenError } from './invalidated-refresh-token-error.storage';

@Injectable()
export class RefreshTokenIdsStorage implements OnApplicationBootstrap, OnApplicationShutdown {
    private redisClient: Redis;

    constructor(@Inject(redisConfig.KEY) private readonly _redisConfig: RedisConfig) {}

    onApplicationBootstrap() {
        this.redisClient = new Redis({
            host: this._redisConfig.host,
            port: this._redisConfig.port,
        });
    }

    onApplicationShutdown(signal?: string) {
        return this.redisClient.quit();
    }

    async insert(userId: uuid, tokenId: string): Promise<void> {
        await this.redisClient.set(this.getKey(userId), tokenId);
    }

    async validate(userId: uuid, tokenId: string): Promise<boolean> {
        const storageId: string = await this.redisClient.get(this.getKey(userId));
        if (storageId !== tokenId) {
            throw new InvalidatedRefreshTokenError();
        }
        return true;
    }

    async invalidate(userId: uuid): Promise<void> {
        await this.redisClient.del(this.getKey(userId));
    }

    getKey(userId: uuid): string {
        return `user-${userId}`;
    }
}
