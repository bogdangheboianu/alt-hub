import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import roLocale from '@angular/common/locales/ro';
import { NgModule } from '@angular/core';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthDataModule } from '@auth/data/auth-data.module';
import { i18nProviders } from '@config/i18n/i18n.providers';
import { interceptorProviders } from '@config/interceptors/interceptor.providers';
import { storeProviders } from '@config/store/store.providers';
import { akitaConfig } from '@datorama/akita';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '@environments/environment';
import { MessageModule } from '@shared/features/message/message.module';
import { NavigationModule } from '@shared/features/navigation/navigation.module';
import * as dayjs from 'dayjs';
import * as ro from 'dayjs/locale/ro';
import * as duration from 'dayjs/plugin/duration';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule( {
               declarations: [
                   AppComponent
               ],
               imports     : [
                   BrowserModule,
                   BrowserAnimationsModule,
                   HttpClientModule,
                   environment.production
                   ? []
                   : AkitaNgDevtools.forRoot( {} ),
                   AuthDataModule,
                   AppRoutingModule,
                   MatDatepickerModule,
                   MatNativeDateModule,
                   MessageModule,
                   NavigationModule
               ],
               providers   : [
                   ...interceptorProviders,
                   ...storeProviders,
                   ...i18nProviders
               ],
               bootstrap   : [ AppComponent ]
           } )
export class AppModule {
    constructor(private dateAdapter: DateAdapter<Date>) {
        registerLocaleData( roLocale );

        dayjs.extend( duration );
        dayjs.extend( relativeTime );
        dayjs.locale( { ...ro, weekStart: 1 } );

        dateAdapter.setLocale( 'ro' );

        akitaConfig( { resettable: true } );
    }
}
