import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { EmploymentInfoDto } from '@dtos/employment-info-dto';
import { UpdateUserEmploymentInfoDto } from '@dtos/update-user-employment-info-dto';
import { FormFields } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { ButtonModule } from '@shared/ui/button/button.module';
import { CancelButtonComponent } from '@shared/ui/button/cancel-button.component';
import { SaveButtonComponent } from '@shared/ui/button/save-button.component';
import { DateInputComponent } from '@shared/ui/input/date-input.component';
import { InputModule } from '@shared/ui/input/input.module';
import { SelectInputComponent, SelectInputOptions } from '@shared/ui/input/select-input.component';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { Changes, takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { Observable } from 'rxjs';

@Component( {
                standalone     : true,
                selector       : 'app-user-employment-info-update-form',
                template       : `
                    <form *ngIf="form" [formGroup]="form" (ngSubmit)="submit()">
                        <app-text-input appInput
                                        label="Employee ID"
                                        formControlName="employeeId"
                                        [required]="true"
                                        [showInputView]="showInputViews"></app-text-input>
                        <app-select-input appInput
                                          label="Company position"
                                          formControlName="companyPositionId"
                                          [options]="companyPositionOptions"
                                          [required]="true"
                                          [showInputView]="showInputViews"
                                          (onInputViewClick)="hideInputViews()"></app-select-input>
                        <app-date-input appInput
                                        label="Hire date"
                                        formControlName="hiredOn"
                                        [required]="true"
                                        [showInputView]="showInputViews"
                                        (onInputViewClick)="hideInputViews()"></app-date-input>
                        <div class="w-100 row m-0 p-0">
                            <div class="col-4 p-0">
                                <app-cancel-button appButton
                                                   *ngIf="!showInputViews"
                                                   (onClick)="cancel()"></app-cancel-button>
                            </div>
                            <div class="col-8 p-0">
                                <app-save-button
                                    appButton
                                    *ngIf="form.dirty && !showInputViews"
                                    [fullWidth]="true"
                                    [disabled]="form.invalid"></app-save-button>
                            </div>
                        </div>
                    </form>
                `,
                imports        : [
                    NgIf,
                    ReactiveFormsModule,
                    CancelButtonComponent,
                    ButtonModule,
                    SaveButtonComponent,
                    SelectInputComponent,
                    InputModule,
                    DateInputComponent,
                    TextInputComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class UserEmploymentInfoUpdateFormComponent extends AbstractForm<UpdateUserEmploymentInfoDto, EmploymentInfoDto> implements OnInit, OnChanges {
    @Input()
    initialValues!: EmploymentInfoDto;

    @Changes( 'initialValues' )
    initialValuesChanges!: Observable<EmploymentInfoDto>;

    @Input()
    loading!: boolean;

    @Input()
    companyPositionOptions!: SelectInputOptions;

    @Input()
    set companyPositionOptionsLoading(value: boolean) {
        const companyPositionInput = this.form?.controls.companyPositionId;
        value
        ? companyPositionInput?.disable()
        : companyPositionInput?.enable();
    }

    @Input()
    override readonly!: boolean;

    @Output()
    onSubmit = new EventEmitter<UpdateUserEmploymentInfoDto>();

    constructor() {
        super( { showInputViews: true } );
    }

    ngOnInit(): void {
        this.init();
        this.initialValuesChanges
            .pipe( takeUntilDestroy( this ) )
            .subscribe( () => this.form.patchValue( this.initialValues ) );
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    protected override formFields(): FormFields<UpdateUserEmploymentInfoDto> {
        return {
            companyPositionId: [ { value: this.initialValues.companyPosition ?? null, disabled: true }, Validators.required ],
            hiredOn          : [ this.initialValues.hiredOn, Validators.required ],
            employeeId       : [ { value: this.initialValues.employeeId, disabled: true }, Validators.required ]
        };
    }
}
