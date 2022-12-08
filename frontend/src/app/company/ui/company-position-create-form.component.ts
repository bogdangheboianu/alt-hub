import { ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateCompanyPositionDto } from '@dtos/create-company-position-dto';
import { FormFields } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { InputModule } from '@shared/ui/input/input.module';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-company-position-create-form',
                template       : `
                    <form [formGroup]="form">
                        <app-text-input appInput
                                        label="New position"
                                        formControlName="name"
                                        hint="Type the new position name and press Enter to save"
                                        (keyUp)="handleNameInputKeyUp($event)"
                                        [required]="true"></app-text-input>
                    </form>
                `,
                imports        : [
                    ReactiveFormsModule,
                    TextInputComponent,
                    InputModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class CompanyPositionCreateFormComponent extends AbstractForm<CreateCompanyPositionDto> implements OnInit {
    @Input()
    override loading!: boolean;

    @Output()
    override onSubmit = new EventEmitter<CreateCompanyPositionDto>();

    override initialValues = null;

    constructor() {
        super();
    }

    ngOnInit(): void {
        this.init();
    }

    handleNameInputKeyUp(event: KeyboardEvent): void {
        if( event.keyCode === ENTER ) {
            event.preventDefault();
            this.submit();
        }
    }

    protected override formFields(): FormFields<CreateCompanyPositionDto> {
        return { name: [ null, Validators.required ] };
    }
}
