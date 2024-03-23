import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ShortUniqueId from 'short-unique-id';
import { RedisRepository } from '../../db/redis/redis.repository';
import { ShortenedURLInterface } from '../../domain/interface/shortened.url.interface';

@Injectable()
export class ShortUrlService {
    private readonly idGenerator: ShortUniqueId;

    private readonly baseURL: string;

    constructor(
        @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
        private readonly configService: ConfigService,
    ) {
        this.idGenerator = new ShortUniqueId({ length: 6 });
        this.baseURL = this.configService.get('BASE_URL');
    }

    async encode(url: string): Promise<Pick<ShortenedURLInterface, 'shortUrl'>> {
        const key = this.idGenerator.randomUUID();
        const data: ShortenedURLInterface = {
            longUrl: url,
            shortUrl: new URL(key, this.baseURL).toString(),
            accessCount: 0,
            createdAt: `${Date.now()}`,
            lastAccessedAt: `${Date.now()}`,
        };
        await this.redisRepository.set(key, JSON.stringify(data));
        return { shortUrl: data.shortUrl };
    }

    async decode(shortURL: string): Promise<Pick<ShortenedURLInterface, 'longUrl'>> {
        const key = new URL(shortURL).pathname.substring(1);
        const shortenedURL = await this.redisRepository.get(key);
        if (!shortenedURL) throw new NotFoundException();

        // Update record access count and last accessed time
        const updatedRecord = this.updateRecord(shortenedURL);
        await this.redisRepository.set(key, updatedRecord);
        const { longUrl } = JSON.parse(updatedRecord);
        return { longUrl };
    }

    async statistics(key: string): Promise<Omit<ShortenedURLInterface, 'longUrl' | 'shortUrl'>> {
        const record = await this.redisRepository.get(key);
        if (!record) throw new NotFoundException();

        const parsedRecord = JSON.parse(record);
        const createdAt = new Date(parsedRecord.createdAt).toISOString();
        const lastAccessedAt = new Date(parsedRecord.lastAccessedAt).toISOString();
        return {
            createdAt,
            accessCount: parsedRecord.accessCount,
            lastAccessedAt,
        };
    }

    private updateRecord(record: string) {
        const parsedRecord = JSON.parse(record) as ShortenedURLInterface;
        parsedRecord.accessCount += 1;
        parsedRecord.lastAccessedAt = `${Date.now()}`;
        return JSON.stringify(parsedRecord);
    }
}
