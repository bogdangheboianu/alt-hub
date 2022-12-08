import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Host, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { minutesToReadableTime } from '@shared/config/functions/duration.functions';
import { InputViewComponent } from '@shared/ui/input/input-view.component';
import { InputDirective } from '@shared/ui/input/input.directive';
import { TimeTrackInputErrorStateMatcher } from '@shared/ui/input/time-track-input-error-state-matcher';

@Component( {
                standalone     : true,
                selector       : 'app-time-track-input',
                template       : `
                    <mat-form-field appearance="outline" *ngIf="!input.showInputView; else inputView">
                        <mat-label>{{ input.label }}</mat-label>
                        <input matInput
                               [(ngModel)]="input.value"
                               [disabled]="input.disabled"
                               [required]="input.required"
                               [class.disabled]="input.disabled"
                               [errorStateMatcher]="errorStateMatcher"
                               placeholder="e.g. 7h30m"
                               (input)="input.onChange($any($event.target).value)"
                               (blur)="input.onTouch()">
                        <mat-hint *ngIf="input.hint">{{ input.hint }}</mat-hint>
                        <mat-error>
                            <ul class="error-list">
                                <li *ngFor="let err of input.errors">{{ err }}</li>
                            </ul>
                        </mat-error>
                    </mat-form-field>
                    <ng-template #inputView>
                        <app-input-view [value]="input.value"
                                        [label]="input.label" (onClick)="input.inputViewClicked()"></app-input-view>
                    </ng-template>
                `,
                imports        : [
                    InputViewComponent,
                    MatFormFieldModule,
                    CommonModule,
                    MatInputModule,
                    FormsModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class TimeTrackInputComponent implements OnInit {
    errorStateMatcher = new TimeTrackInputErrorStateMatcher();

    constructor(@Host() public readonly input: InputDirective<number | string>) {
    }

    ngOnInit(): void {
        if( typeof this.input.value !== 'number' ) {
            throw TypeError( 'Time worked input value must be type number' );
        }

        this.input.writeValue( minutesToReadableTime( this.input.value as number )
                                   .replace( ' ', '' ) );
        this.input.onChange( this.input.value );
    }
}
