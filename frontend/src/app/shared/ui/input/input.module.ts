import { NgModule } from '@angular/core';
import { InputDirective } from '@shared/ui/input/input.directive';

@NgModule( {
               declarations: [ InputDirective ],
               exports     : [ InputDirective ]
           } )
export class InputModule {
}
