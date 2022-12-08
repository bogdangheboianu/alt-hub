import { setupSwagger } from '@configuration/functions/setup-swagger.function';
import { ConfigurationService } from '@configuration/services/configuration.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create( AppModule );
    const configuration = app.get( ConfigurationService );

    app.enableCors( { origin: [ configuration.frontendBaseUrl ] } );

    setupSwagger( app );

    await app.listen( 3000 );
}

bootstrap();
