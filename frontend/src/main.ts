import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableAkitaProdMode } from '@datorama/akita';
import { environment } from '@environments/environment';
import { AppModule } from './app/app.module';

if( environment.production ) {
    enableProdMode();
    enableAkitaProdMode();
}

platformBrowserDynamic()
    .bootstrapModule( AppModule )
    .catch( err => console.error( err ) );
