import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { ShortUrlController } from './application/url-shortener/url-shortener.controller';
import { ShortUrlService } from './application/url-shortener/url-shortener.service';
import { configValidationSchema } from './config/config.schema';
import { DBModule } from './db/mongodb/db.module';
import { RedisModule } from './db/redis/redis.module';
import { Logger } from './utils/logger';

@Module({
    imports: [
        WinstonModule.forRoot(new Logger().getLoggerConfig()),
        ConfigModule.forRoot({
            validationSchema: configValidationSchema,
            isGlobal: true,
        }),
        RedisModule,
        DBModule,
    ],
    controllers: [ShortUrlController],
    providers: [ShortUrlService],
})
export class AppModule {}
