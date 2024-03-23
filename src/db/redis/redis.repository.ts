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
        const record = await this.redisClient.get(key);
        if (!record) return null;
        // Update record access count and last accessed time
        const updatedRecord = this.updateRecord(record);
        await this.set(key, updatedRecord);
        return JSON.parse(updatedRecord);
    }

    async set(key: string, value: string): Promise<void> {
        // Expiry is set to 30 day
        await this.redisClient.set(key, value, 'EX', thirtyDaysInSeconds);
    }

    private updateRecord(record: string) {
        const parsedRecord = JSON.parse(record);
        parsedRecord.accessCount += 1;
        parsedRecord.lastAccessedAt = Date.now();
        return JSON.stringify(parsedRecord);
    }
}
