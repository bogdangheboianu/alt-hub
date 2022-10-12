import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ClientOperationMessage } from '@client/constants/client-operation-message.enum';
import { ClientActions } from '@client/store/client.actions';
import { ClientSelectors } from '@client/store/client.selectors';
import { CreateClientDto } from '@dtos/create-client.dto';
import { BaseForm, SuccessfulSubmissionMessage } from '@shared/directives/base-form.directive';
import { FormFields, FormGroupTyped } from '@shared/types/form.types';

@Component( {
                selector   : 'app-create-client-form',
                templateUrl: './create-client-form.component.html',
                styleUrls  : [ './create-client-form.component.scss' ]
            } )
export class CreateClientFormComponent extends BaseForm<CreateClientDto> implements OnInit {
    form!: FormGroupTyped<CreateClientDto>;

    constructor(
        public readonly dialogRef: MatDialogRef<CreateClientFormComponent>,
        private readonly formBuilder: FormBuilder,
        private readonly clientActions: ClientActions,
        private readonly clientSelectors: ClientSelectors
    ) {
        super( clientSelectors );
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.form = this.buildForm();
    }

    protected override buildForm(): FormGroupTyped<CreateClientDto> {
        const fields: FormFields<CreateClientDto> = {
            name: [ '', Validators.required ]
        };
        return this.formBuilder.nonNullable.group<CreateClientDto>( fields );
    }

    protected override onSubmit(): void {
        this.clientActions.createClient( this.form.getRawValue() );
    }

    protected override onSuccessfulSubmission(): SuccessfulSubmissionMessage {
        this.closeDialog();
        return ClientOperationMessage.Created;
    }
}
