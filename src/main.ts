import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { appConfig, AppConfig } from './app/config/app.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // * Active global pipes
    app.useGlobalPipes(new ValidationPipe());

    // * Set a prefix to all routes
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    // * Introduce appConfig
    const appConfigInstance: AppConfig = app.get(appConfig.KEY);

    // * Start server
    await app.listen(appConfigInstance.port);

    console.log();
    Logger.log(
        `🐼 HTTP is online at: http://${appConfigInstance.host}:${appConfigInstance.port}/${globalPrefix}`,
    );
    Logger.log(
        `🐼 Socket is available at: http://${appConfigInstance.host}:${appConfigInstance.port}`,
    );
}
bootstrap();
