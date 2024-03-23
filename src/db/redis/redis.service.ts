import { Inject, Injectable } from '@nestjs/common';
import ShortUniqueId from 'short-unique-id';
import { shortenedURLInterface } from '../../domain/interface/shortened.url.interface';
import { RedisRepository } from './redis.repository';

@Injectable()
export class RedisService {
    private readonly uuidGenerator: ShortUniqueId;

    private readonly baseURL = 'https://sho.rt';

    constructor(@Inject(RedisRepository) private readonly redisRepository: RedisRepository) {
        this.uuidGenerator = new ShortUniqueId({ length: 6 });
    }

    async saveURL(url: string): Promise<shortenedURLInterface> {
        const key = this.uuidGenerator.randomUUID();
        const data: shortenedURLInterface = {
            originalURL: url,
            shortURL: `${this.baseURL}/${key}`,
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
        if (!shortenedURL) return null;
        return JSON.parse(shortenedURL);
    }
}
