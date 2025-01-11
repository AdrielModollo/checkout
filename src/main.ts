import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from 'src/app/communs/logger.winston';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('API de Pedidos')
        .setDescription('API para criação e gerenciamento de pedidos.')
        .setVersion('1.0')
        .addTag('orders')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.useLogger(logger);

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: false,
    }));

    app.enableCors();

    await app.listen(3000);
    logger.info('Application is running on: http://localhost:3000');
}

bootstrap();
