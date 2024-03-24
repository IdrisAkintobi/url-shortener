import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ShortUniqueId from 'short-unique-id';
import { ShortUrlRepository } from '../../db/mongodb/repository/short-url.repository';
import { ShortenedURLInterface } from '../../domain/interface/shortened.url.interface';

@Injectable()
export class ShortUrlService {
    private readonly idGenerator: ShortUniqueId;

    private readonly baseURL: string;

    constructor(
        private readonly shortUrlRepository: ShortUrlRepository,
        private readonly configService: ConfigService,
    ) {
        this.idGenerator = new ShortUniqueId({
            length: this.configService.get('SHORT_URL_LENGTH'),
        });
        this.baseURL = this.configService.get('BASE_URL');
    }

    async encode(url: string): Promise<Pick<ShortenedURLInterface, 'shortUrl'>> {
        const id = this.idGenerator.randomUUID();
        const data = {
            id,
            longUrl: url,
            shortUrl: new URL(id, this.baseURL).toString(),
        };
        const shortenedURL = await this.shortUrlRepository.create(data);
        return { shortUrl: shortenedURL.shortUrl };
    }

    async decode(shortURL: string): Promise<Pick<ShortenedURLInterface, 'longUrl'>> {
        const key = new URL(shortURL).pathname.substring(1);
        const shortenedURL = await this.shortUrlRepository.findById(key);
        if (!shortenedURL) throw new NotFoundException();

        // Update record access count and last accessed time
        await this.shortUrlRepository.updateAccessCount(key);
        return { longUrl: shortenedURL.longUrl };
    }

    async statistics(key: string): Promise<ShortenedURLInterface> {
        const shortenedURL = await this.shortUrlRepository.findById(key);
        if (!shortenedURL) throw new NotFoundException();

        return shortenedURL.toObject();
    }
}
