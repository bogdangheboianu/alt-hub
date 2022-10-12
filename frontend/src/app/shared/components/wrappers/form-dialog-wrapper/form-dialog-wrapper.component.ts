import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component( {
                selector   : 'app-form-dialog-wrapper',
                templateUrl: './form-dialog-wrapper.component.html',
                styleUrls  : [ './form-dialog-wrapper.component.scss' ]
            } )
export class FormDialogWrapperComponent {
    @Input() title!: string;
    @Input() showActionButtons = true;

    @Output() onCancelBtnClick = new EventEmitter();
    @Output() onSaveBtnClick = new EventEmitter();
}
