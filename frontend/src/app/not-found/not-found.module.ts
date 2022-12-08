import { NgModule } from '@angular/core';
import { NotFoundRoutingModule } from '@not-found/not-found-routing.module';
import { NotFoundComponent } from '@not-found/not-found.component';

@NgModule( {
               imports     : [
                   NotFoundRoutingModule
               ],
               declarations: [ NotFoundComponent ]
           } )
export class NotFoundModule {
}
