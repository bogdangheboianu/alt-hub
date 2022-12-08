import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Host, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { onlyDate } from '@shared/config/functions/date.functions';
import { valueIsEmpty } from '@shared/config/functions/value.functions';
import { InputViewComponent } from '@shared/ui/input/input-view.component';
import { InputDirective } from '@shared/ui/input/input.directive';
import { InputModule } from '@shared/ui/input/input.module';

@Component( {
                standalone     : true,
                selector       : 'app-date-input',
                template       : `
                    <mat-form-field appearance="outline" *ngIf="!input.showInputView; else inputView">
                        <mat-label>{{ input.label }}</mat-label>
                        <input matInput
                               [(ngModel)]="input.value"
                               [matDatepicker]="datePicker"
                               [disabled]="input.disabled"
                               [required]="input.required"
                               [class.disabled]="input.disabled"
                               [max]="maxDate ?? null"
                               [errorStateMatcher]="input.errorStateMatcher"
                               (dateInput)="handleInput($any($event.target).value)"
                               (dateChange)="handleInput($any($event.target).value)"
                               (blur)="input.onTouch()">
                        <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
                        <mat-datepicker #datePicker></mat-datepicker>
                        <mat-hint>{{ input.hint }}</mat-hint>
                        <mat-error *ngIf="input.errors.length > 0">
                            <ul class="error-list">
                                <li *ngFor="let error of input.errors">{{ error }}</li>
                            </ul>
                        </mat-error>
                    </mat-form-field>
                    <ng-template #inputView>
                        <app-input-view [value]="input.value"
                                        [label]="input.label" (onClick)="input.inputViewClicked()"></app-input-view>
                    </ng-template>
                `,
                imports        : [
                    CommonModule,
                    MatFormFieldModule,
                    MatInputModule,
                    FormsModule,
                    InputModule,
                    InputViewComponent,
                    MatDatepickerModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class DateInputComponent implements OnInit, AfterViewInit {
    @Input()
    maxDate?: Date;

    @ViewChild( MatInput )
    matInput!: MatInput;

    constructor(@Host() public readonly input: InputDirective<Date | string>) {
    }

    ngOnInit(): void {
        if( valueIsEmpty( this.input.hint ) ) {
            this.input.hint = 'DD.MM.YYYY';
        }
    }

    ngAfterViewInit(): void {
        this.input.inputElement = this.matInput;
    }

    handleInput(value: Date) {
        this.input.onChange( onlyDate( value ) );
    }
}
