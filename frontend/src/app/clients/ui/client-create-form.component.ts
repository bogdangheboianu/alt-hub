import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateClientDto } from '@dtos/create-client-dto';
import { FormFields } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { ButtonModule } from '@shared/ui/button/button.module';
import { SaveButtonComponent } from '@shared/ui/button/save-button.component';
import { InputModule } from '@shared/ui/input/input.module';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-client-create-form',
                template       : `
                    <form [formGroup]="form">
                        <app-text-input appInput
                                        label="Name"
                                        formControlName="name"
                                        [required]="true"></app-text-input>
                        <app-save-button appButton [disabled]="loading" (onClick)="submit()"></app-save-button>
                    </form>
                `,
                imports        : [
                    CommonModule,
                    ReactiveFormsModule,
                    InputModule,
                    TextInputComponent,
                    SaveButtonComponent,
                    ButtonModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ClientCreateFormComponent extends AbstractForm<CreateClientDto> implements OnInit {
    @Input()
    override loading!: boolean;

    @Output()
    override onSubmit = new EventEmitter<CreateClientDto>();

    override initialValues = null;

    constructor() {
        super();
    }

    ngOnInit(): void {
        this.init();
    }

    protected override formFields(): FormFields<CreateClientDto> {
        return { name: [ null, Validators.required ] };
    }
}
