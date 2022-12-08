import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalService } from '@shared/features/modal/modal.service';

@NgModule( {
               imports  : [ MatDialogModule ],
               providers: [ ModalService ]
           } )
export class ModalModule {
}
