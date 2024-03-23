import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ShortUniqueId from 'short-unique-id';
import { shortenedURLInterface } from '../../domain/interface/shortened.url.interface';
import { RedisRepository } from './redis.repository';

@Injectable()
export class RedisService {
    private readonly idGenerator: ShortUniqueId;

    private readonly baseURL: string;

    constructor(
        @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
        private readonly configService: ConfigService,
    ) {
        this.idGenerator = new ShortUniqueId({ length: 6 });
        this.baseURL = this.configService.get('BASE_URL');
    }

    async saveURL(url: string): Promise<shortenedURLInterface> {
        const key = this.idGenerator.randomUUID();
        const data: shortenedURLInterface = {
            originalURL: url,
            shortURL: new URL(key, this.baseURL).toString(),
            accessCount: 0,
            createdAt: Date.now(),
            lastAccessedAt: Date.now(),
        };
        await this.redisRepository.set(key, JSON.stringify(data));
        return data;
    }

    async getURL(shortURL: string): Promise<shortenedURLInterface | null> {
        const key = new URL(shortURL).pathname.substring(1);
        const shortenedURL = await this.redisRepository.get(key);
        return JSON.parse(shortenedURL);
    }
}
