import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config/config.schema';
import { RedisModule } from './db/redis/redis.module';

@Module({
    imports: [
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
