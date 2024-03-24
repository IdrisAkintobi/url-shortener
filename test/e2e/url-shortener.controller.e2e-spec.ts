import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { InjectOptions } from 'light-my-request';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ShortUrlController } from '../../src/application/url-shortener/url-shortener.controller';
import { ShortUrlService } from '../../src/application/url-shortener/url-shortener.service';
import { loggerMock } from '../mock/logger.mock';
import { shortUrlServiceMock } from '../mock/short-url.service.mock';

describe('ShortUrlController E2E', () => {
    let app: NestFastifyApplication;
    const id = 'abc123';
    const longUrl = 'https://example.com/this-is-a-very-long-url';
    const shortUrl = `https://short.est/${id}`;

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            controllers: [ShortUrlController],
            providers: [
                { provide: ShortUrlService, useValue: shortUrlServiceMock },
                { provide: WINSTON_MODULE_PROVIDER, useValue: loggerMock },
            ],
        }).compile();

        app = testingModule.createNestApplication(
            new FastifyAdapter({ ignoreTrailingSlash: true }),
        );
        app.useGlobalPipes(new ValidationPipe({ transform: true, validateCustomDecorators: true }));

        await app.init();
    });

    describe('v1/encode [POST]', () => {
        const payload = { longUrl };
        const url = '/v1/encode';
        it('should encode a long URL', async () => {
            const response = await app.inject({
                url,
                method: 'POST',
                payload,
            });
            expect(response.statusCode).toBe(201);
        });

        it('should return a 400 when the payload is not passed', async () => {
            const response = await app.inject({
                url,
                method: 'POST',
                payload: {},
            });
            expect(response.statusCode).toBe(400);
        });

        it('should log with the debug method when error is encountered', async () => {
            await app.inject({
                url,
                method: 'POST',
                payload: {},
            });
            expect(loggerMock.debug).toHaveBeenCalled();
        });

        it('should return a 400 when the payload is not a valid url', async () => {
            const response = await app.inject({
                url,
                method: 'POST',
                payload: { longUrl: 'example@email.com' },
            });
            expect(response.statusCode).toBe(400);
        });

        // it should return 404 for other methods
        const otherMethods: Array<InjectOptions['method']> = ['GET', 'PUT', 'DELETE'];
        it.each(otherMethods)('should return 404 for %s', async method => {
            const response = await app.inject({
                url,
                method,
            });
            expect(response.statusCode).toBe(404);
        });
    });

    describe('v1/decode [POST]', () => {
        const payload = { shortUrl };
        const url = '/v1/decode';
        it('should decode a short URL', async () => {
            const response = await app.inject({
                url,
                method: 'POST',
                payload,
            });
            expect(response.statusCode).toBe(200);
        });

        it('should return a 400 when the payload is not passed', async () => {
            const response = await app.inject({
                url,
                method: 'POST',
                payload: {},
            });
            expect(response.statusCode).toBe(400);
        });

        it('should return a 400 when the payload is not a valid url', async () => {
            const response = await app.inject({
                url,
                method: 'POST',
                payload: { shortUrl: 'example@email.com' },
            });
            expect(response.statusCode).toBe(400);
        });

        // it should return 404 for other methods
        const otherMethods: Array<InjectOptions['method']> = ['GET', 'PUT', 'DELETE'];
        it.each(otherMethods)('should return 404 for %s', async method => {
            const response = await app.inject({
                url,
                method,
            });
            expect(response.statusCode).toBe(404);
        });
    });

    describe('v1/statistic [GET]', () => {
        const url = `/v1/statistic/${id}`;
        it('should return a statistic', async () => {
            const response = await app.inject({
                url,
                method: 'GET',
            });
            expect(response.statusCode).toBe(200);
        });

        // it should return 404 for other methods
        const otherMethods: Array<InjectOptions['method']> = ['POST', 'PUT', 'DELETE'];
        it.each(otherMethods)('should return 404 for %s', async method => {
            const response = await app.inject({
                url,
                method,
            });
            expect(response.statusCode).toBe(404);
        });

        it('should return 404 if no short url id', async () => {
            const url = `/v1/statistic/`;
            const response = await app.inject({
                url,
                method: 'GET',
            });
            expect(response.statusCode).toBe(404);
        });
    });
});
