import { ShortenedURLInterface } from '../../src/domain/interface/shortened.url.interface';

export class ShortenedUrlBuilder {
    private shortenedUrl: ShortenedURLInterface & { id?: string } = {
        longUrl: 'https://example.com/this-is-a-very-long-url',
        shortUrl: 'https://short.est/abc123',
        createdAt: '2024-03-23T12:20:38.882Z',
        lastAccessedAt: '2024-03-23T12:20:38.882Z',
        accessCount: 0,
    };

    constructor() {}

    public withId(id: string): ShortenedUrlBuilder {
        this.shortenedUrl.id = id;
        return this;
    }

    public build() {
        return this.shortenedUrl;
    }

    public toObject() {
        return this.shortenedUrl;
    }
}
