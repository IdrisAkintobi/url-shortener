import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DecodeResponseDto } from '../../src/application/url-shortener/dto/response/decode.response.dto';
import { EncodeResponseDto } from '../../src/application/url-shortener/dto/response/encode.response.dto';
import { ShortUrlController } from '../../src/application/url-shortener/url-shortener.controller';
import { ShortUrlService } from '../../src/application/url-shortener/url-shortener.service';
import { HttpResponseMapper } from '../../src/utils/http-resources/http-response-mapper';
import { ShortenedUrlBuilder } from '../builder/product.builder';
import { loggerMock } from '../mock/logger.mock';
import { shortUrlServiceMock } from '../mock/short-url.service.mock';

describe('ShortUrlController', () => {
    let controller: ShortUrlController;
    const key = 'abc123';
    const { longUrl, shortUrl, id } = new ShortenedUrlBuilder().withId(key).build();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ShortUrlController],
            providers: [
                { provide: ShortUrlService, useValue: shortUrlServiceMock },
                { provide: WINSTON_MODULE_PROVIDER, useValue: loggerMock },
            ],
        }).compile();

        controller = module.get<ShortUrlController>(ShortUrlController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('encode', () => {
        it('should encode a long URL', async () => {
            const expected: EncodeResponseDto = { shortUrl: 'abc123' };

            shortUrlServiceMock.encode.mockResolvedValue(expected);

            const result = await controller.encode({ longUrl });
            expect(result).toEqual(HttpResponseMapper.map(expected));
        });
    });

    describe('decode', () => {
        it('should decode a short URL', async () => {
            const expected: DecodeResponseDto = { longUrl };

            shortUrlServiceMock.decode.mockResolvedValue(expected);

            const result = await controller.decode({ shortUrl });
            expect(result).toEqual(HttpResponseMapper.map(expected));
        });
    });

    describe('statistic', () => {
        it('should return statistics for a short URL', async () => {
            const expected = new ShortenedUrlBuilder().build();

            shortUrlServiceMock.statistics.mockResolvedValue(expected);

            const result = await controller.statistic({ path: id });
            expect(result).toEqual(HttpResponseMapper.map(expected));
        });
    });
});
