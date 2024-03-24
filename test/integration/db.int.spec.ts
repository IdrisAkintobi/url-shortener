import { ConfigModule, ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { DBModule } from '../../src/db/mongodb/db.module';
import { ShortUrlRepository } from '../../src/db/mongodb/repository/short-url.repository';
import { ShortUrl } from '../../src/db/mongodb/schemas/short-url.schema';
import { configServiceMock } from '../mock/config.service.mock';

describe('ShortUrlController E2E', () => {
    let repository: ShortUrlRepository;
    let model: Model<any>;
    let testingModule: TestingModule;
    const data = {
        id: '1',
        longUrl: 'https://example.com/this-is-a-very-long-url',
        shortUrl: 'https://short.est/abc123',
    };

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ isGlobal: true }), DBModule],
        })
            .overrideProvider(ConfigService)
            .useValue(configServiceMock)
            .compile();

        repository = testingModule.get<ShortUrlRepository>(ShortUrlRepository);
        model = testingModule.get<Model<any>>(getModelToken(ShortUrl.name));
    });

    afterAll(async () => {
        await model.deleteMany({});
        await testingModule.close();
    });

    it('should create a new short url', async () => {
        await repository.create(data);

        const result = await repository.findById('1');
        expect(result).toMatchObject(data);
    });

    it('should find by long url', async () => {
        const result = await repository.findByLongUrl(data.longUrl);
        expect(result).toEqual(expect.objectContaining(data));
    });

    it('should increase access count and last access date', async () => {
        const previousResult = await repository.findByLongUrl(data.longUrl);
        const latestResult = await repository.findById(data.id);
        expect(latestResult.accessCount).toBe(previousResult.accessCount + 1);
        expect(new Date(latestResult.lastAccessedAt).getTime()).toBeGreaterThan(
            new Date(previousResult.lastAccessedAt).getTime(),
        );
    });

    it('should not save new record if record with longUrl already exists', async () => {
        const newData = { ...data, id: '2' };
        await repository.create(newData);

        const result = await repository.findById(newData.id);
        expect(result).toBeNull();
    });
});
