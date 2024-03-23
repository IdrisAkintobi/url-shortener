import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export const redisClientFactory: FactoryProvider<Redis> = {
    provide: 'RedisClient',
    useFactory: (configService: ConfigService) => {
        const redisInstance = new Redis({
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
        });

        redisInstance.on('error', e => {
            throw new Error(`Redis connection failed: ${e}`);
        });

        return redisInstance;
    },
    inject: [ConfigService],
};
