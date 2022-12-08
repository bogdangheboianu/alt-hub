import { NgModule } from '@angular/core';
import { NavigationService } from '@shared/features/navigation/navigation.service';

@NgModule( {
               providers: [ NavigationService ]
           } )
export class NavigationModule {
}
