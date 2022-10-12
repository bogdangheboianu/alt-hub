import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from '@environments/environment';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import { AppModule } from './app/app.module';

dayjs.extend( duration );
dayjs.extend( relativeTime );

if( environment.production ) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule( AppModule )
    .catch( err => console.error( err ) );
