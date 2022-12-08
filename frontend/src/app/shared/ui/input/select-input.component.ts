import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Host, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { valueIsSelectInputOption } from '@shared/config/functions/value.functions';
import { InputViewComponent } from '@shared/ui/input/input-view.component';
import { InputDirective } from '@shared/ui/input/input.directive';

export interface ISelectInputOption {
    id: string;
    name: string;
    description?: string;
}

export type SelectInputOptions = ISelectInputOption[];

@Component( {
                standalone     : true,
                selector       : 'app-select-input',
                template       : `
                    <mat-form-field appearance="outline" *ngIf="!input.showInputView; else inputView">
                        <mat-label>{{ input.label }}</mat-label>
                        <mat-select [(ngModel)]="selectValue"
                                    [disabled]="input.disabled"
                                    [required]="input.required"
                                    [class.disabled]="input.disabled"
                                    [errorStateMatcher]="input.errorStateMatcher"
                                    (selectionChange)="onSelectionChange($event)"
                                    (blur)="input.onTouch()">
                            <mat-option *ngFor="let option of options"
                                        [value]="option.id">{{ option.name }}</mat-option>
                        </mat-select>
                        <mat-hint *ngIf="input.hint">{{ input.hint }}</mat-hint>
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
                    MatSelectModule,
                    FormsModule,
                    InputViewComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class SelectInputComponent implements OnInit {
    @Input()
    options!: SelectInputOptions;

    @Output()
    onSelect = new EventEmitter<string>();

    selectValue = '';

    constructor(@Host() public readonly input: InputDirective<ISelectInputOption | string>) {
    }

    ngOnInit(): void {
        this.selectValue = valueIsSelectInputOption( this.input.value )
                           ? this.input.value.id
                           : this.input.value ?? '';
    }

    onSelectionChange(event: MatSelectChange): void {
        this.input.onChange( event.value );
        this.onSelect.emit( event.value );
    }
}
