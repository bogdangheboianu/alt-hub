import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '@auth/auth.module';
import { JwtInterceptor } from '@auth/interceptors/jwt.interceptor';
import { persistState } from '@datorama/akita';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '@environments/environment';
import { LayoutModule } from '@layout/layout.module';
import { ApiRequestInterceptor } from '@shared/interceptors/api-request.interceptor';
import { ApiResponseInterceptor } from '@shared/interceptors/api-response.interceptor';
import { SharedModule } from '@shared/shared.module';
import { PERSIST_STORAGE } from '@shared/store/store.providers';
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
                   : AkitaNgDevtools.forRoot(),
                   SharedModule,
                   AuthModule,
                   AppRoutingModule,
                   LayoutModule
               ],
               providers   : [
                   {
                       provide : HTTP_INTERCEPTORS,
                       useClass: ApiRequestInterceptor,
                       multi   : true
                   },
                   {
                       provide : HTTP_INTERCEPTORS,
                       useClass: ApiResponseInterceptor,
                       multi   : true
                   },
                   {
                       provide : HTTP_INTERCEPTORS,
                       useClass: JwtInterceptor,
                       multi   : true
                   },
                   {
                       provide : PERSIST_STORAGE,
                       useValue: persistState( { include: [ 'auth' ] } )
                   }
               ],
               bootstrap   : [ AppComponent ]
           } )
export class AppModule {
}
