import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { UserDto } from '@dtos/user-dto';
import { VacationDto } from '@dtos/vacation-dto';
import { VacationTypeEnum } from '@dtos/vacation-type-enum';
import { SharedPipesModule } from '@shared/pipes/shared.pipes.module';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { SectionTitleComponent } from '@shared/ui/section-title.component';
import { userFullName } from '@users/config/user.functions';
import { VacationTypeColors } from '@vacations/config/vacation.constants';
import { VacationsByTimePeriod } from '@vacations/config/vacation.interfaces';
import { VacationIconComponent } from '@vacations/ui/vacation-icon.component';
import { VacationsCardListComponent } from '@vacations/ui/vacations-card-list.component';
import { Chart, LegendItem, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { enUS } from 'date-fns/locale';
import { isEmpty } from 'lodash-es';

Chart.register( ...registerables );
Chart.register( zoomPlugin );
Chart.register( annotationPlugin );

@Component( {
                standalone: true,
                selector  : 'app-vacations-gantt-chart',
                template  : `
                    <app-loading-bar [visible]="loading"></app-loading-bar>
                    <ng-container *ngIf="hasAnyVacation(); else noVacations">
                        <ng-container *ngIf="vacationsByTimePeriod.ongoing.length > 0">
                            <ng-container *ngIf="vacationsByTimePeriod.ongoing[0] as vacation">
                                <div class="mb-3">
                                    <app-section-title
                                        *ngIf="!showOngoingVacationsAsCardList"
                                        title="Ongoing"></app-section-title>
                                </div>
                                <div class="ongoing-vacation mb-4 shadow-sm" *ngIf="!showOngoingVacationsAsCardList; else ongoingCardList">
                                    <div class="ongoing-vacation-working-days-badge">{{ vacation.workingDays }} working days</div>
                                    <app-vacation-icon [vacationType]="vacation.type"></app-vacation-icon>
                                    <span style="font-size: 17px; margin-right: 7px; font-weight: bold">{{ vacation.fromDate | readableDate }}</span>
                                    <mat-icon style="font-size: 20px; height: 20px">arrow_circle_right</mat-icon>
                                    <span style="font-size: 17px; margin-left: 7px; font-weight: bold">{{ vacation.toDate | readableDate }}</span>
                                </div>
                                <ng-template #ongoingCardList>
                                    <app-vacations-card-list title="Ongoing"
                                                             [vacations]="vacationsByTimePeriod.ongoing"
                                                             [showUsers]="showUsersOnCards"
                                                             [horizontalScroll]="listsHorizontalScroll"
                                                             (onEditButtonClick)="onEditButtonClick.emit($event)"
                                                             (onUserClick)="onUserClick.emit($event)"></app-vacations-card-list>
                                    <mat-divider *ngIf="vacationsByTimePeriod.future.length > 0 && vacationsByTimePeriod.past.length > 0" style="margin: 15px 0"></mat-divider>
                                </ng-template>
                            </ng-container>
                        </ng-container>
                        <ng-container *ngIf="vacationsByTimePeriod.future.length > 0">
                            <app-vacations-card-list title="Later this year"
                                                     [editDisabled]="!enableFutureVacationsEdit"
                                                     [vacations]="vacationsByTimePeriod.future"
                                                     [showUsers]="showUsersOnCards"
                                                     [horizontalScroll]="listsHorizontalScroll"
                                                     (onEditButtonClick)="onEditButtonClick.emit($event)"
                                                     (onUserClick)="onUserClick.emit($event)"></app-vacations-card-list>
                        </ng-container>
                        <mat-divider *ngIf="vacationsByTimePeriod.future.length > 0 && vacationsByTimePeriod.past.length > 0" style="margin: 15px 0"></mat-divider>
                        <ng-container *ngIf="vacationsByTimePeriod.past.length > 0">
                            <app-vacations-card-list title="Past"
                                                     [vacations]="vacationsByTimePeriod.past"
                                                     [showUsers]="showUsersOnCards"
                                                     [horizontalScroll]="listsHorizontalScroll"
                                                     (onEditButtonClick)="onEditButtonClick.emit($event)"
                                                     (onUserClick)="onUserClick.emit($event)"></app-vacations-card-list>
                        </ng-container>
                    </ng-container>
                    <ng-template #noVacations>
                        <em>No vacations this year</em>
                    </ng-template>
                    <ng-container>
                        <div style="width:100%;">
                            <canvas id="vacationsChart" #vacationsChart></canvas>
                        </div>
                    </ng-container>
                `,
                styles  : [
                    `
                        .ongoing-vacation {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 10px;
                            border-radius: 5px;
                            background: #d1f8ef;
                            position: relative;
                        }

                        .ongoing-vacation-working-days-badge {
                            position: absolute;
                            top: 7px;
                            left: 7px;
                            padding: 2px 5px;
                            background: #f48fb1;
                            color: rgba(0, 0, 0, 0.87);
                            text-align: center;
                            border-radius: 5px;
                            font-weight: 400;
                            font-size: 12px;
                            font-family: Roboto, "Helvetica Neue", sans-serif;
                        }

                    `
                ],
                imports        : [
                    CommonModule,
                    VacationsCardListComponent,
                    SectionTitleComponent,
                    VacationIconComponent,
                    MatIconModule,
                    SharedPipesModule,
                    MatDividerModule,
                    LoadingBarComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class VacationsGanttChartComponent implements AfterViewInit {

    @ViewChild( 'vacationsChart' ) vacationsChart: any;

    @Input()
    vacationsByTimePeriod!: VacationsByTimePeriod;

    @Input()
    loading!: boolean;

    vacations: VacationDto[] = [];

    @Input()
    showOngoingVacationsAsCardList = false;

    @Input()
    enableFutureVacationsEdit = true;

    @Input()
    showUsersOnCards = false;

    @Input()
    listsHorizontalScroll = false;

    @Output()
    onEditButtonClick = new EventEmitter<VacationDto>();

    @Output()
    onUserClick = new EventEmitter<UserDto>();

    hasAnyVacation(): boolean {
        const { past, ongoing, future } = this.vacationsByTimePeriod;
        return past.length !== 0 || ongoing.length !== 0 || future.length !== 0;
    }

    ngAfterViewInit(): void {
        this.vacations = this.vacationsByTimePeriod.future
                             .concat( this.vacationsByTimePeriod.ongoing )
                             .concat( this.vacationsByTimePeriod.past );
        this.createChart();
    }

    createChart() {
        const elem = this.vacationsChart.nativeElement;
        const labels: string[] = [ ...new Set( this.vacations.map( vacation => userFullName( vacation.annualEmployeeSheet.user ) ) ) ];
        const firstDayOfMonth = new Date( new Date().getFullYear(), new Date().getMonth(), 1 );
        try {
            new Chart( elem, {
                type   : 'bar',
                data   : {
                    labels  : labels,
                    datasets: this.vacations.map( vacation => {
                        const data = [];
                        const lastVacationDay = new Date( vacation.toDate );
                        data[labels.indexOf( userFullName( vacation.annualEmployeeSheet.user ) )] = [ new Date( vacation.fromDate ), new Date( lastVacationDay ).setDate( lastVacationDay.getDate() + 1 ) ];
                        return {
                            label          : userFullName( vacation.annualEmployeeSheet.user ),
                            data           : data,
                            backgroundColor: this.vacationColor( vacation ),
                            borderColor    : 'black',
                            barPercentage  : 1.25
                        };
                    } )
                },
                options: {
                    responsive         : true,
                    maintainAspectRatio: false,
                    indexAxis          : 'y',
                    scales             : {
                        x: {
                            min     : firstDayOfMonth.valueOf(),
                            max     : new Date( firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0 ).valueOf(),
                            position: 'top',
                            type    : 'time',
                            time    : {
                                unit: 'day'
                            },
                            bounds  : 'ticks',
                            adapters: {
                                date: {
                                    locale: enUS
                                }
                            }
                        },
                        y: {
                            stacked: true
                        }
                    },
                    plugins            : {
                        legend    : {
                            display: true,
                            labels : {
                                generateLabels(): LegendItem[] {
                                    return [
                                        {
                                            text     : 'Sick leave',
                                            fontColor: VacationTypeColors.Sick_Leave,
                                            fillStyle: VacationTypeColors.Sick_Leave
                                        },
                                        {
                                            text     : 'Annual leave',
                                            fontColor: VacationTypeColors.Annual_Leave,
                                            fillStyle: VacationTypeColors.Annual_Leave
                                        },
                                        {
                                            text     : 'Unpaid leave',
                                            fontColor: VacationTypeColors.Unpaid_Leave,
                                            fillStyle: VacationTypeColors.Unpaid_Leave
                                        }
                                    ];
                                }
                            }
                        },
                        tooltip   : {
                            position : 'nearest',
                            callbacks: {
                                label(tooltipItem: any): string | string[] | void {
                                    return tooltipItem.dataset.data.filter( (item: any) => !isEmpty( item ) );
                                },
                                title(tooltipItems: any[]): string | string[] | void {
                                    return tooltipItems[0].label;
                                }
                            }
                        },
                        zoom      : {
                            limits: {
                                x: {
                                    min: firstDayOfMonth.valueOf(),
                                    max: new Date( firstDayOfMonth.getFullYear() + 1, firstDayOfMonth.getMonth(), 0 ).valueOf()
                                }
                            },
                            pan   : {
                                enabled: true,
                                mode   : 'x'
                            },
                            zoom  : {
                                wheel: {
                                    enabled: true
                                },
                                mode : 'x'
                            }
                        },
                        annotation: {
                            annotations: {
                                line1: {
                                    type       : 'line',
                                    xMin       : new Date().valueOf(),
                                    xMax       : new Date().valueOf(),
                                    borderColor: '#5E3BFF'
                                }
                            }
                        }
                    }
                }
            } );
        } catch( err ) {
            console.log( err );
        }
    }

    private vacationColor(vacation: VacationDto): VacationTypeColors {
        if( vacation.type === VacationTypeEnum.SickLeave ) {
            return VacationTypeColors.Sick_Leave;
        }
        if( vacation.type === VacationTypeEnum.AnnualLeave ) {
            return VacationTypeColors.Annual_Leave;
        }
        return VacationTypeColors.Unpaid_Leave;
    }
}
