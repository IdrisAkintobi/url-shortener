import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

import { RedisRepositoryInterface } from '../../domain/interface/redis.repository.interface';

const thirtyDaysInSeconds = 60 * 60 * 24 * 30;

@Injectable()
export class RedisRepository implements OnModuleDestroy, RedisRepositoryInterface {
    constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

    onModuleDestroy(): void {
        this.redisClient.disconnect();
    }

    async get(key: string): Promise<string | null> {
        return this.redisClient.get(key);
    }

    async set(key: string, value: string): Promise<void> {
        // Expiry is set to 30 day
        await this.redisClient.set(key, value, 'EX', thirtyDaysInSeconds);
    }
}
