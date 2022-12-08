import { NgModule } from '@angular/core';
import { AuthDataModule } from '@auth/data/auth-data.module';
import { IsAdminDirective } from '@auth/directives/is-admin/is-admin.directive';

@NgModule( {
               imports     : [ AuthDataModule ],
               declarations: [ IsAdminDirective ],
               exports     : [ IsAdminDirective ]
           } )
export class IsAdminModule {
}
