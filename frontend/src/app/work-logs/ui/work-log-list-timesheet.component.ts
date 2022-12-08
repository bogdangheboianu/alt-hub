import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HolidayDto } from '@dtos/holiday-dto';
import { VacationDto } from '@dtos/vacation-dto';
import { WorkLogDto } from '@dtos/work-log-dto';
import { ClosedDateInterval } from '@shared/config/constants/shared.types';
import { arrayDistinct } from '@shared/config/functions/array.functions';
import { dateIsBetween, datesAreEqual } from '@shared/config/functions/date.functions';
import { minutesToReadableTime } from '@shared/config/functions/duration.functions';
import { valueIsEmpty, valueIsNotEmpty } from '@shared/config/functions/value.functions';
import { SharedPipesModule } from '@shared/pipes/shared.pipes.module';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { userFullName } from '@users/config/user.functions';
import * as dayjs from 'dayjs';
import { sumBy } from 'lodash';
import { BehaviorSubject } from 'rxjs';

type Cell = {
    workLogs: WorkLogDto[];
    userName: string;
    vacation?: VacationDto;
    backgroundColor: string;
    tooltip: string;
};
type Column = {
    def: string;
    header: string;
    cell: (rowData: Row) => string,
    backgroundColor: string,
    holiday?: HolidayDto;
    tooltip: string;
}

type Row = { [date: string]: Cell };
type DataSource = Row[]
type Columns = Column[];

@Component( {
                standalone     : true,
                selector       : 'app-work-log-list-timesheet',
                template       : `
                    <app-loading-bar [visible]="(loading$ | async)!"></app-loading-bar>
                    <section class="table-container" tabindex="0">
                        <table mat-table [dataSource]="dataSource">
                            <ng-container matColumnDef="userName" sticky>
                                <th mat-header-cell *matHeaderCellDef class="th-w-100"> Employee</th>
                                <td mat-cell *matCellDef="let rowData"> {{ ($any(rowData | keyvalue)[0].value)['userName'] }}</td>
                            </ng-container>
                            <ng-container [matColumnDef]="column.def" *ngFor="let column of columns">
                                <th mat-header-cell
                                    class="th-w-30"
                                    *matHeaderCellDef
                                    [style.background-color]="column.backgroundColor"
                                    [innerHTML]="column.header"
                                    [matTooltip]="column.tooltip"></th>
                                <td mat-cell
                                    class="td-custom"
                                    *matCellDef="let rowData"
                                    [style.background-color]="rowData[column.def]['backgroundColor']"
                                    [matTooltip]="rowData[column.def]['tooltip']">{{ column.cell(rowData) }}</td>
                            </ng-container>
                            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                        </table>
                    </section>
                `,
                styles         : [
                    `
                        .table-container {
                            display: block;
                            overflow-x: auto;
                        }

                        table {
                            min-width: 2000px;
                        }

                        .th-w-30 {
                            width: 50px;
                            text-align: center;
                        }

                        .td-custom {
                            text-align: center;
                        }

                        .th-w-100 {
                            width: 200px;
                        }
                    `
                ],
                imports        : [
                    CommonModule,
                    LoadingBarComponent,
                    MatTableModule,
                    SharedPipesModule,
                    MatTooltipModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class WorkLogListTimesheetComponent implements OnInit, OnChanges {
    @Input()
    workLogs!: WorkLogDto[];

    @Input()
    set workLogsLoading(value: boolean) {
        this._workLogsLoading = value;
        this.setLoading();
    }

    @Input()
    dateInterval!: ClosedDateInterval;

    @Input()
    vacations!: VacationDto[];

    @Input()
    set vacationsLoading(value: boolean) {
        this._vacationsLoading = value;
        this.setLoading();
    }

    @Input()
    holidays!: HolidayDto[];

    @Input()
    set holidaysLoading(value: boolean) {
        this._holidaysLoading = value;
        this.setLoading();
    }

    loading$ = new BehaviorSubject( false );
    columns: Columns = [];
    displayedColumns: string[] = [];
    dataSource: DataSource = [];
    private _workLogsLoading!: boolean;
    private _vacationsLoading!: boolean;
    private _holidaysLoading!: boolean;

    ngOnInit(): void {
        this.load();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.load();
    }

    private load(): void {
        this.setColumns();
        this.setDataSource();
    }

    private setColumns(): void {
        const fromDate = new Date( this.dateInterval.fromDate );
        const toDate = new Date( this.dateInterval.toDate );
        let loopDate = new Date( fromDate );
        const columns: Columns = [];
        const displayedColumns: string[] = [ 'userName' ];

        while( loopDate <= toDate ) {
            const loopDateString = loopDate.toString();
            const loopDateDayjs = dayjs( loopDate );
            const isWorkingDay = loopDate.getDay() !== 6 && loopDate.getDay() !== 0;
            const holiday = this.holidays.find( h => datesAreEqual( h.date, loopDate ) );
            const tooltip = holiday?.name ?? '';
            const backgroundColor = valueIsNotEmpty( holiday )
                                    ? 'rgba(244,143,177,0.39)'
                                    : isWorkingDay
                                      ? 'none'
                                      : '#e0e0e0';
            columns.push( {
                              def    : loopDateString,
                              header : `
                                <strong>${ loopDateDayjs.format( 'DD' ) }</strong><br>
                                <span>${ loopDateDayjs.format( 'dd' ) }</span>`,
                              cell   : (rowData: Row) => {
                                  const workLogs = rowData[loopDateString].workLogs;
                                  return valueIsEmpty( workLogs )
                                         ? ''
                                         : minutesToReadableTime( sumBy( workLogs.map( wl => wl.minutesLogged ) ) );
                              },
                              backgroundColor,
                              holiday: this.holidays.find( h => datesAreEqual( h.date, loopDate ) ),
                              tooltip
                          } );
            displayedColumns.push( loopDateString );

            const nextDate = loopDate.setDate( loopDate.getDate() + 1 );
            loopDate = new Date( nextDate );
        }

        this.columns = columns;
        this.displayedColumns = displayedColumns;
    }

    private setDataSource(): void {
        const usersFullNames = arrayDistinct( this.workLogs.map( wl => userFullName( wl.user ) ) );
        this.dataSource = usersFullNames.map( userName => {
            const rowData: Row = {};
            this.columns.forEach( col => {
                const workLogs = this.workLogs.filter( wl => datesAreEqual( wl.date, col.def ) && userFullName( wl.user ) === userName );
                const vacation = this.vacations.find( v => userFullName( v.annualEmployeeSheet.user ) === userName && dateIsBetween( col.def, v.fromDate, v.toDate ) );
                const tooltip = valueIsNotEmpty( vacation )
                                ? vacation.type
                                : col.tooltip;
                const backgroundColor = valueIsNotEmpty( vacation )
                                        ? 'rgb(244,164,158)'
                                        : col.backgroundColor;
                rowData[col.def] = { workLogs, userName, backgroundColor, vacation, tooltip };
            } );
            return rowData;
        } );
    }

    private setLoading(): void {
        const isLoading = this._workLogsLoading || this._vacationsLoading || this._holidaysLoading;
        this.loading$.next( isLoading );
    }
}
