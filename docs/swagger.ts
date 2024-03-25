import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { promises as fs } from 'fs';
import { join } from 'path';

import { description, name, version } from '../package.json';
import { AppModule } from '../src/app.module';

async function createSwaggerDocs(): Promise<void> {
    const outDir = join(__dirname, 'swagger.json');

    const app = await NestFactory.create(AppModule);
    const options = new DocumentBuilder()
        .setTitle(name)
        .setDescription(description)
        .setVersion(version)
        .build();
    const document = SwaggerModule.createDocument(app, options);

    await fs.writeFile(outDir, JSON.stringify(document, null, 4));
    await app.close();
}

createSwaggerDocs().catch((e: Error) => {
    console.log(e);
});
