import { NgModule } from '@angular/core';
import { PublicRoutingModule } from '@layouts/public/public-routing.module';
import { PublicComponent } from '@layouts/public/public.component';

@NgModule( {
               imports     : [ PublicRoutingModule ],
               declarations: [ PublicComponent ]
           } )
export class PublicModule {
}
