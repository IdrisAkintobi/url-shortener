import { Module } from '@nestjs/common';
import { RedisModule } from './db/redis/redis.module';

@Module({
    imports: [RedisModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
