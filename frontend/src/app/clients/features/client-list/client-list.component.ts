import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ClientListDataService } from '@clients/features/client-list/client-list-data.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector       : 'app-client-list',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <app-header>
                            <app-title headerLeft title="Clients" icon="work"></app-title>
                            <app-create-button appButton
                                               headerRight
                                               (onClick)="navigationService.clientCreate()"></app-create-button>
                        </app-header>
                        <app-container>
                            <app-client-list-table [clients]="data.entities"
                                                   [loading]="data.loading"
                                                   (onRowClick)="navigationService.clientDetails($event.id)"></app-client-list-table>
                        </app-container>
                    </ng-container>
                `,
                providers      : [ ClientListDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ClientListComponent implements OnInit {
    constructor(
        public readonly dataService: ClientListDataService,
        public readonly navigationService: NavigationService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }
}
