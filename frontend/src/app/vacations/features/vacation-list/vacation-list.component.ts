import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { VacationListDataService } from '@vacations/features/vacation-list/vacation-list-data.service';
import 'chartjs-adapter-date-fns';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector: 'app-vacation-list',
                template: `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <app-header>
                            <app-title headerLeft title="Vacations" icon="houseboat"></app-title>
                        </app-header>
                        <app-container>
                            <app-vacations-gantt-chart
                                [vacationsByTimePeriod]="data.vacationsByTimePeriod"
                                [loading]="data.loading"
                                [showOngoingVacationsAsCardList]="true"
                                [enableFutureVacationsEdit]="false"
                                [showUsersOnCards]="true"
                                [listsHorizontalScroll]="true"
                                (onUserClick)="navigationService.userDetails($event.id)"
                            ></app-vacations-gantt-chart>
                        </app-container>
                    </ng-container>
                `,
                providers: [ VacationListDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class VacationListComponent implements OnInit {
    constructor(
        public readonly dataService: VacationListDataService,
        public readonly navigationService: NavigationService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }
}

