import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            disableRequestLogging: true,
            ignoreTrailingSlash: true,
            logger: true,
        }),
    );
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    const configService = app.get(ConfigService);
    const port = configService.get('APP_PORT');
    await app.listen(port);
}
bootstrap();
