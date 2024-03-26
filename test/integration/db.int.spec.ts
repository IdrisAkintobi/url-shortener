import { ConfigModule } from '@nestjs/config';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import { DBModule } from '../../src/db/mongodb/db.module';
import { ShortUrlRepository } from '../../src/db/mongodb/repository/short-url.repository';

let mongod: MongoMemoryServer;

describe('ShortUrlController E2E', () => {
    let connection: Connection;
    let repository: ShortUrlRepository;
    let testingModule: TestingModule;
    const data = {
        id: '1',
        longUrl: 'https://example.com/this-is-a-very-long-url',
        shortUrl: 'https://short.est/abc123',
    };

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        //set mongo uri for test environment
        process.env.MONGO_URI = mongod.getUri();

        testingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ isGlobal: true }), DBModule],
        }).compile();

        repository = testingModule.get<ShortUrlRepository>(ShortUrlRepository);
        connection = await testingModule.get(getConnectionToken());
    });

    afterAll(async () => {
        await connection.close();
        await mongod.stop();
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
        const previousResult = await repository.findById(data.id);
        await repository.updateAccessCount(data.id);
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
