import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ShortUrl extends Document {
    @Prop({ unique: true })
    id: string;

    @Prop({ index: true })
    longUrl: string;

    @Prop()
    shortUrl: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: 0 })
    accessCount: number;

    @Prop()
    lastAccessedAt: string;
}

export const ShortUrlSchema = SchemaFactory.createForClass(ShortUrl);
ShortUrlSchema.set('toObject', {
    transform: function (doc, ret) {
        delete ret.__v;
        delete ret._id;
        delete ret.id;
    },
});

// increment access count and update lastAccessedAt on find() call.
ShortUrlSchema.pre('findOne', async function () {
    const filter = this.getFilter();
    const update = {
        $inc: { accessCount: 1 },
        $set: { lastAccessedAt: new Date().toISOString() },
    };
    await this.model.findOneAndUpdate(filter, update);
});
