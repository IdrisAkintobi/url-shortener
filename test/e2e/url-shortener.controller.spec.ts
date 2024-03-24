import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ShortUrlController } from '../../src/application/url-shortener/url-shortener.controller';
import { ShortUrlService } from '../../src/application/url-shortener/url-shortener.service';
import { loggerMock } from '../mock/logger.mock';
import { shortUrlServiceMock } from '../mock/short-url.service.mock';

describe('ShortUrlController', () => {
    let app: NestFastifyApplication;

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            controllers: [ShortUrlController],
            providers: [
                { provide: ShortUrlService, useValue: shortUrlServiceMock },
                { provide: WINSTON_MODULE_PROVIDER, useValue: loggerMock },
            ],
        }).compile();

        app = testingModule.createNestApplication(new FastifyAdapter());
        app.useGlobalPipes(new ValidationPipe({ transform: true, validateCustomDecorators: true }));

        await app.init();
    });

    it('should be defined', () => {
        expect(app).toBeDefined();
    });

    describe('v1/encode', () => {
        const payload = { longUrl: 'https://example.com/this-is-a-very-long-url' };
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

        it('should return a 400 when the payload is not a valid url', async () => {
            const response = await app.inject({
                url,
                method: 'POST',
                payload: { longUrl: 'example@email.com' },
            });
            expect(response.statusCode).toBe(400);
        });
    });
});
