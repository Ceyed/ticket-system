import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { uuid } from 'common/types/uuid.constant';
import Redis from 'ioredis';
import { RedisConfigEnum } from 'src/app/config/redis.config';
import { InvalidatedRefreshTokenError } from './invalidated-refresh-token-error.storage';

@Injectable()
export class RefreshTokenIdsStorage implements OnApplicationBootstrap, OnApplicationShutdown {
    private redisClient: Redis;

    constructor(private readonly _clientService: ConfigService) {}

    onApplicationBootstrap() {
        const host = this._clientService.get<string>(RedisConfigEnum.REDIS_HOST);
        const port = this._clientService.get<number>(RedisConfigEnum.REDIS_PORT);
        this.redisClient = new Redis({
            host,
            port,
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
