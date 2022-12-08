import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorMessageComponent } from '@shared/features/message/error-message.component';
import { MessageService } from '@shared/features/message/message.service';
import { SuccessMessageComponent } from '@shared/features/message/success-message.component';

@NgModule( {
               imports     : [
                   CommonModule,
                   MatSnackBarModule
               ],
               declarations: [
                   SuccessMessageComponent,
                   ErrorMessageComponent
               ],
               providers   : [ MessageService ]
           } )
export class MessageModule {

}
