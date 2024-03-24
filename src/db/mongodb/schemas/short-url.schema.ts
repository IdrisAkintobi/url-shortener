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

    @Prop({ default: new Date().toISOString() })
    createdAt: string;

    @Prop({ default: 0 })
    accessCount: number;

    @Prop({ default: new Date().toISOString() })
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
