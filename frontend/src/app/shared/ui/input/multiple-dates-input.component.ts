import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Host, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { onlyDate } from '@shared/config/functions/date.functions';
import { valueIsEmpty } from '@shared/config/functions/value.functions';
import { SharedPipesModule } from '@shared/pipes/shared.pipes.module';
import { InputViewComponent } from '@shared/ui/input/input-view.component';
import { InputDirective } from '@shared/ui/input/input.directive';
import { InputModule } from '@shared/ui/input/input.module';

@Component( {
                standalone     : true,
                selector       : 'app-multiple-dates-input',
                template       : `
                    <mat-form-field *ngIf="!input.showInputView; else inputView" appearance="outline">
                        <mat-label>{{ input.label }}</mat-label>
                        <mat-chip-list #chipList aria-label="Dates selection" [required]="input.required">
                            <mat-chip (removed)="remove(date)" *ngFor="let date of input.value">
                                {{ date | readableDate }}
                                <button matChipRemove>
                                    <mat-icon>cancel</mat-icon>
                                </button>
                            </mat-chip>
                            <input (blur)="input.onTouch()"
                                   [class.disabled]="input.disabled"
                                   [disabled]="input.disabled"
                                   [errorStateMatcher]="input.errorStateMatcher"
                                   [mat-menu-trigger-for]="calendar"
                                   [matChipInputAddOnBlur]="addOnBlur"
                                   [matChipInputFor]="chipList"
                                   [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                                   [max]="maxDate ?? null"
                                   [required]="input.required"
                                   [autocomplete]="false"
                                   matInput>
                        </mat-chip-list>
                        <mat-menu #calendar class="drop-calendar">
                            <div (click)="$event.stopPropagation()">
                                <mat-calendar #picker (selectedChange)="select($event,picker)" [dateClass]="dateClass"></mat-calendar>
                            </div>
                        </mat-menu>
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
                    </ng-template>`,
                imports        : [
                    InputModule,
                    CommonModule,
                    MatFormFieldModule,
                    MatChipsModule,
                    SharedPipesModule,
                    MatIconModule,
                    MatInputModule,
                    MatMenuModule,
                    MatDatepickerModule,
                    InputViewComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class MultipleDatesInputComponent {
    @Input() maxDate?: Date;

    addOnBlur = true;
    readonly separatorKeysCodes = [ ENTER, COMMA ] as const;

    constructor(@Host() public readonly input: InputDirective<Date[]>) {
    }

    dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
        if( valueIsEmpty( this.input.value ) ) {
            return '';
        }
        if( view === 'month' ) {
            return this.input.value!.map( date => onlyDate( date ) )
                                    .includes( onlyDate( cellDate ) )
                   ? 'selected'
                   : '';
        }

        return '';
    };

    select(event: Date | null, picker: any) {
        if( valueIsEmpty( event ) ) {
            return;
        }
        const index = this.input.value!.findIndex( x => onlyDate( x ) == onlyDate( event ) );
        if( index < 0 ) {
            this.input.value!.push( new Date( onlyDate( event! ) ) );
            this.input.onChange( this.input.value! );
        } else {
            this.input.value!.splice( index, 1 );
            this.input.onChange( this.input.value! );
        }

        picker.updateTodaysDate();
    }

    remove(date: Date): void {
        const index = this.input.value!.findIndex( x => onlyDate( x ) == onlyDate( date ) );
        this.input.value!.splice( index, 1 );
        this.input.onChange( this.input.value! );
    }
}
