import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisPrefixesEnum } from 'common/enums/redis-prefixes.enum';
import { RedisSubPrefixesEnum } from 'common/enums/redis-sub-prefixes.enum';
import { createClient, RedisClientType } from 'redis';
import { RedisConfigEnum } from 'src/app/config/redis.config';

@Injectable()
export class RedisHelperService implements OnModuleInit, OnModuleDestroy {
    private _redisClient: RedisClientType;
    private readonly _logger: Logger = new Logger(RedisHelperService.name);

    constructor(private readonly _clientService: ConfigService) {}

    async onModuleInit() {
        const host = this._clientService.get<string>(RedisConfigEnum.REDIS_HOST);
        const port = this._clientService.get<number>(RedisConfigEnum.REDIS_PORT);
        const password = this._clientService.get<string>(RedisConfigEnum.REDIS_PASSWORD);

        this._redisClient = createClient({
            url: `redis://${host}:${port}`,
        });
        await this._redisClient.connect();
        this._logger.log('Connected to Redis');
    }

    async onModuleDestroy() {
        await this._redisClient.disconnect();
        this._logger.log('Disconnected from Redis');
    }

    getStandardKey(
        keyPrefix: RedisPrefixesEnum,
        subPrefix: RedisSubPrefixesEnum,
        id: string,
    ): string {
        return keyPrefix + ':' + subPrefix + ':' + id;
    }

    getStandardKeyWithoutId(keyPrefix: RedisPrefixesEnum, subPrefix: RedisSubPrefixesEnum): string {
        return keyPrefix + ':' + subPrefix;
    }

    getPatternKey(keyPrefix: RedisPrefixesEnum, subPrefix?: RedisSubPrefixesEnum): string {
        let pattern = keyPrefix + ':';
        if (subPrefix) pattern += subPrefix + ':';
        return pattern + '*';
    }

    async setCache<T>(key: string, value: T, ttl?: number): Promise<void> {
        const stringFormat = JSON.stringify(value);
        await this._redisClient.set(key, stringFormat);
        if (ttl) {
            await this._redisClient.expire(key, ttl);
        }
    }

    async getCache<T>(key: string): Promise<T> {
        const cachedKey = await this._redisClient.get(key);
        if (cachedKey) {
            return JSON.parse(cachedKey) as T;
        }
    }

    async removeCache(key: string) {
        await this._redisClient.del(key);
    }

    async deleteByPattern(pattern: string) {
        const keys = await this._redisClient.keys(pattern);
        if (keys?.length) {
            await this._redisClient.del(keys);
        }
    }

    /**
     * This function checks to see if there is data with your key in redis, else will
     * fetch it from db and store it as cache if it does not exists it will return null
     * @param key: Your redis key
     * @param getDataCallback: The function and repo query to get your data
     */
    async getFromCacheOrDb<T>(
        key: string,
        getDataCallback: () => Promise<T>,
        ttl?: number,
    ): Promise<T> {
        const valueFromRedis: T = await this.getCache<T>(key);
        if (valueFromRedis) {
            // TODO Ceyed: Remove logs
            console.log('from redis');
            return valueFromRedis;
        }

        console.log('from db');

        const valueFromDb: T = await getDataCallback();
        if (!valueFromDb) return;

        this.setCache<T>(key, valueFromDb, ttl);
        return valueFromDb;
    }
}
