import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientOperationMessage } from '@client/constants/client-operation-message.enum';
import { IUpdateClientFormDialogData } from '@client/interfaces/update-client-form-dialog-data.interface';
import { ClientActions } from '@client/store/client.actions';
import { ClientSelectors } from '@client/store/client.selectors';
import { UpdateClientDto } from '@dtos/update-client.dto';
import { BaseForm, SuccessfulSubmissionMessage } from '@shared/directives/base-form.directive';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector   : 'app-update-client-form',
                templateUrl: './update-client-form.component.html',
                styleUrls  : [ './update-client-form.component.scss' ]
            } )
@UntilDestroy()
export class UpdateClientFormComponent extends BaseForm<UpdateClientDto> implements OnInit {
    form!: FormGroupTyped<UpdateClientDto>;

    constructor(
        @Inject( MAT_DIALOG_DATA ) public data: IUpdateClientFormDialogData,
        public dialogRef: MatDialogRef<UpdateClientFormComponent>,
        private formBuilder: FormBuilder,
        private clientActions: ClientActions,
        private clientSelectors: ClientSelectors
    ) {
        super( clientSelectors );
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.form = this.buildForm();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    protected override buildForm(): FormGroupTyped<UpdateClientDto> {
        const fields: FormFields<UpdateClientDto> = {
            name: [ this.data.client.name, Validators.required ]
        };
        return this.formBuilder.nonNullable.group<UpdateClientDto>( fields );
    }

    protected override onSubmit(): void | Promise<void> {
        this.clientActions.updateClient( this.data.client.id, this.form.getRawValue() );
    }

    protected override onSuccessfulSubmission(): SuccessfulSubmissionMessage {
        this.closeDialog();
        return ClientOperationMessage.Updated;
    }
}
