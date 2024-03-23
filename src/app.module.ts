import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { configValidationSchema } from './config/config.schema';
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
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
