import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientUpdateFormModalData } from '@clients/config/client.interfaces';
import { ClientDto } from '@dtos/client-dto';
import { UpdateClientDto } from '@dtos/update-client-dto';
import { ComponentInstance, FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { SaveButtonComponent } from '@shared/ui/button/save-button.component';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { InputModule } from '@shared/ui/input/input.module';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-client-update-form',
                template       : `
                    <app-form-modal title="Update client"
                                    [loading]="loading"
                                    (onSaveBtnClick)="submit()"
                                    (onCancelBtnClick)="cancel()">
                        <form [formGroup]="form">
                            <app-text-input appInput
                                            label="Name"
                                            formControlName="name"
                                            [required]="true"></app-text-input>
                        </form>
                    </app-form-modal>
                `,
                imports        : [
                    CommonModule,
                    ReactiveFormsModule,
                    TextInputComponent,
                    InputModule,
                    SaveButtonComponent,
                    FormModalComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ClientUpdateFormComponent extends AbstractForm<UpdateClientDto, ClientDto> implements OnInit {
    override loading = false;
    override onSubmit: SubmitFn<UpdateClientDto>;
    override initialValues: ClientDto;

    constructor(@Inject( MAT_DIALOG_DATA ) private data: ClientUpdateFormModalData) {
        super( { loadingSrc$: data.loading$ } );
        this.initialValues = data.client;
        this.onSubmit = data.onSubmit;
    }

    ngOnInit(): void {
        this.init();
    }

    override cancel(): void {
        super.cancel();
        this.data.onCancel();
    }

    protected override formFields(): FormFields<UpdateClientDto> {
        return { name: [ this.initialValues!.name, Validators.required ] };
    }

    protected override componentInstance(): ComponentInstance | null {
        return this;
    }
}
