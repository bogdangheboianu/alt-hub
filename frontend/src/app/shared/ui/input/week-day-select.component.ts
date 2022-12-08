import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Host } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { WeekDayEnum } from '@dtos/week-day-enum';
import { WeekDayNumericEnum } from '@shared/config/constants/shared.constants';
import { InputDirective } from '@shared/ui/input/input.directive';
import { InputModule } from '@shared/ui/input/input.module';

@Component( {
                standalone     : true,
                selector       : 'app-week-day-select',
                template       : `
                    <mat-button-toggle-group name="week-days" aria-label="Week days" multiple>
                        <ng-container *ngFor="let dayName of weekDays; let day = index">
                            <mat-button-toggle [value]="day"
                                               [checked]="isDaySelected(day)"
                                               (change)="toggleWeekDay($event)">{{ dayName }}</mat-button-toggle>
                        </ng-container>
                    </mat-button-toggle-group>
                `,
                imports        : [
                    InputModule,
                    CommonModule,
                    MatButtonToggleModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class WeekDaySelectComponent {
    weekDays = [
        WeekDayEnum.Monday,
        WeekDayEnum.Tuesday,
        WeekDayEnum.Wednesday,
        WeekDayEnum.Thursday,
        WeekDayEnum.Friday,
        WeekDayEnum.Saturday,
        WeekDayEnum.Sunday
    ];

    constructor(@Host() public readonly input: InputDirective<WeekDayNumericEnum[]>) {
    }

    isDaySelected(day: WeekDayNumericEnum): boolean {
        return this.input.value?.includes( day ) ?? false;
    }

    toggleWeekDay(change: MatButtonToggleChange): void {
        const day = change.value as WeekDayNumericEnum;
        const newValue = change.source.checked
                         ? [ ...this.input.value ?? [], day ]
                         : this.input.value?.filter( d => d !== day ) ?? null;
        this.input.writeValue( newValue );
        this.input.onChange( newValue );
    }
}
