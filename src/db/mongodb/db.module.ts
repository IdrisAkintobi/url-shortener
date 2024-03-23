import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortUrlRepository } from './repository/short-url.repository';
import { ShortUrl, ShortUrlSchema } from './schemas/short-url.schema';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URI'),
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([{ name: ShortUrl.name, schema: ShortUrlSchema }]),
        ConfigModule.forRoot(),
    ],
    providers: [ShortUrlRepository],
    exports: [ShortUrlRepository],
})
export class DBModule {}
