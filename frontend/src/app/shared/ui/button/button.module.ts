import { NgModule } from '@angular/core';
import { ButtonDirective } from '@shared/ui/button/button.directive';

@NgModule( {
               declarations: [ ButtonDirective ],
               exports     : [ ButtonDirective ]
           } )
export class ButtonModule {
}
