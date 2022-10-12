import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create( AppModule );

    app.enableCors();

    setupSwagger( app );

    await app.listen( 3000 );
}

function setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle( 'Altamira Hub' )
        .setVersion( '1.0' )
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument( app, config );

    SwaggerModule.setup( 'swagger', app, document );
}

bootstrap();
