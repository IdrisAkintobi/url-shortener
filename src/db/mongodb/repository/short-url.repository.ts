import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortUrl } from '../schemas/short-url.schema';

@Injectable()
export class ShortUrlRepository {
    constructor(@InjectModel(ShortUrl.name) private readonly shortUrlModel: Model<ShortUrl>) {}

    async create(data: Pick<ShortUrl, 'id' | 'longUrl' | 'shortUrl'>): Promise<ShortUrl> {
        const existingRecord = await this.findByLongUrl(data.longUrl);
        if (existingRecord) return existingRecord;
        return this.shortUrlModel.create(data);
    }

    async findById(id: string): Promise<ShortUrl> {
        return this.shortUrlModel.findOne({ id }).exec();
    }

    async findByLongUrl(longUrl: string): Promise<ShortUrl> {
        return this.shortUrlModel.findOne({ longUrl }).exec();
    }

    async updateAccessCount(id: string): Promise<void> {
        const update = {
            $inc: { accessCount: 1 },
            $set: { lastAccessedAt: new Date().toISOString() },
        };
        await this.shortUrlModel.findOneAndUpdate({ id }, update);
    }
}
