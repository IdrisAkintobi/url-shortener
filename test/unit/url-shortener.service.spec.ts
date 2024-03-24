import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ShortUrlService } from '../../src/application/url-shortener/url-shortener.service';
import { ShortUrlRepository } from '../../src/db/mongodb/repository/short-url.repository';
import { ShortenedUrlBuilder } from '../builder/product.builder';
import { configServiceMock } from '../mock/config.service.mock';
import { shortUrlRepositoryMock } from '../mock/short-url.repository.mock';

// Mock ShortUniqueId class
jest.mock('short-unique-id', () => ({
    default: jest.fn().mockImplementation(() => ({
        randomUUID: jest.fn(() => 'abc123'),
    })),
}));

describe('ShortUrlService', () => {
    let service: ShortUrlService;
    const key = 'abc123';
    const { longUrl, shortUrl, id } = new ShortenedUrlBuilder().withId(key).build();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ShortUrlService,
                { provide: ShortUrlRepository, useValue: shortUrlRepositoryMock },
                { provide: ConfigService, useValue: configServiceMock },
            ],
        }).compile();

        service = module.get<ShortUrlService>(ShortUrlService);
    });

    describe('encode', () => {
        it('should return a shortened URL', async () => {
            shortUrlRepositoryMock.create.mockResolvedValueOnce({ shortUrl });

            const result = await service.encode(longUrl);
            expect(result.shortUrl).toEqual(shortUrl);
        });
    });

    describe('decode', () => {
        it('should return the original URL', async () => {
            shortUrlRepositoryMock.findById.mockResolvedValueOnce({ longUrl });

            const result = await service.decode(shortUrl);
            expect(result.longUrl).toEqual(longUrl);
        });

        it('should throw NotFoundException if URL is not found', async () => {
            shortUrlRepositoryMock.findById.mockResolvedValueOnce(null);
            await expect(service.decode(shortUrl)).rejects.toThrowError(NotFoundException);
        });
    });

    describe('statistics', () => {
        it('should return the statistics of a shortened URL', async () => {
            const shortenedURL = new ShortenedUrlBuilder().withId(id);

            shortUrlRepositoryMock.findById.mockResolvedValueOnce(shortenedURL);

            const result = await service.statistics(id);
            expect(result).toEqual(shortenedURL.build());
        });

        it('should throw NotFoundException if URL is not found', async () => {
            shortUrlRepositoryMock.findById.mockResolvedValueOnce(null);
            await expect(service.statistics(id)).rejects.toThrow(NotFoundException);
        });
    });
});
