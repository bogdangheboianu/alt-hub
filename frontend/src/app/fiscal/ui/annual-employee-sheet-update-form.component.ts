import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { AnnualEmployeeSheetDto } from '@dtos/annual-employee-sheet-dto';
import { UpdateAnnualEmployeeSheetDto } from '@dtos/update-annual-employee-sheet-dto';
import { FormFields } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { ButtonModule } from '@shared/ui/button/button.module';
import { CancelButtonComponent } from '@shared/ui/button/cancel-button.component';
import { SaveButtonComponent } from '@shared/ui/button/save-button.component';
import { InputModule } from '@shared/ui/input/input.module';
import { NumberInputComponent } from '@shared/ui/input/number-input.component';
import { Changes, takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { Observable } from 'rxjs';

@Component( {
                standalone     : true,
                selector       : 'app-annual-employee-sheet-update-form',
                template       : `
                    <form *ngIf="form" [formGroup]="form">
                        <app-number-input appInput
                                          label="Paid leave days"
                                          formControlName="paidLeaveDays"
                                          [showInputView]="showInputViews"
                                          [required]="true"
                                          (onInputViewClick)="hideInputViews()"></app-number-input>
                        <app-number-input appInput
                                          label="Remaining paid leave days"
                                          formControlName="remainingPaidLeaveDays"
                                          [showInputView]="showInputViews"
                                          [required]="true"
                                          (onInputViewClick)="hideInputViews()"></app-number-input>
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
                                    [disabled]="form.invalid"
                                    (onClick)="submit()"></app-save-button>
                            </div>
                        </div>
                    </form>
                `,
                imports        : [
                    CommonModule,
                    ReactiveFormsModule,
                    NumberInputComponent,
                    InputModule,
                    CancelButtonComponent,
                    SaveButtonComponent,
                    ButtonModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class AnnualEmployeeSheetUpdateFormComponent extends AbstractForm<UpdateAnnualEmployeeSheetDto, AnnualEmployeeSheetDto> implements OnInit, OnChanges {
    @Input()
    initialValues!: AnnualEmployeeSheetDto;

    @Changes( 'initialValues' )
    initialValuesChanges!: Observable<AnnualEmployeeSheetDto>;

    @Input()
    loading!: boolean;

    @Input()
    override readonly!: boolean;

    @Output()
    onSubmit = new EventEmitter<UpdateAnnualEmployeeSheetDto>();

    constructor() {
        super( { showInputViews: true } );
    }

    ngOnInit(): void {
        this.init();
        this.initialValuesChanges
            .pipe( takeUntilDestroy( this ) )
            .subscribe( () => this.setForm() );
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    protected override formFields(): FormFields<UpdateAnnualEmployeeSheetDto> {
        return {
            paidLeaveDays         : [ this.initialValues?.paidLeaveDays, Validators.required ],
            remainingPaidLeaveDays: [ this.initialValues?.remainingPaidLeaveDays, Validators.required ]
        };
    }
}
