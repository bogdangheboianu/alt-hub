import { NgModule } from '@angular/core';
import { AuthDataModule } from '@auth/data/auth-data.module';
import { IsOwnProfilePageDirective } from '@auth/directives/is-own-profile-page/is-own-profile-page.directive';

@NgModule( {
               imports     : [ AuthDataModule ],
               declarations: [ IsOwnProfilePageDirective ],
               exports     : [ IsOwnProfilePageDirective ]
           } )
export class IsOwnProfilePageModule {
}
