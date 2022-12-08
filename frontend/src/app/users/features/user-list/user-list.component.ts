import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserStatusEnum } from '@dtos/user-status-enum';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { UserListDataService } from '@users/features/user-list/user-list-data.service';
import { UntilDestroy } from 'ngx-reactivetoolkit';

type UsersTabLabel = string;
type TabToUserStatusesMap = { [tabLabel: UsersTabLabel]: UserStatusEnum[] }

@Component( {
                selector       : 'app-user-list',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <app-header>
                            <app-title headerLeft title="Employees" icon="group"></app-title>
                            <app-create-button appButton headerRight (onClick)="navigationService.userCreate()"></app-create-button>
                        </app-header>
                        <app-container>
                            <mat-tab-group mat-stretch-tabs
                                           *ngIf="data.entities as users"
                                           (selectedTabChange)="onTabChange($event)">
                                <mat-tab [label]="ACTIVE_USERS_TAB_LABEL">
                                    <app-user-list-table [users]="users"
                                                         [loading]="data.loading"
                                                         (onRowClick)="navigationService.userDetails($event.id)"></app-user-list-table>
                                </mat-tab>
                                <mat-tab [label]="ONBOARDING_USERS_TAB_LABEL">
                                    <app-user-list-table [users]="users"
                                                         [loading]="data.loading"
                                                         [showStatus]="true"
                                                         (onRowClick)="navigationService.userDetails($event.id)"></app-user-list-table>
                                </mat-tab>
                                <mat-tab [label]="INACTIVE_USERS_TAB_LABEL">
                                    <app-user-list-table [users]="users"
                                                         [loading]="data.loading"
                                                         (onRowClick)="navigationService.userDetails($event.id)"></app-user-list-table>
                                </mat-tab>
                            </mat-tab-group>
                        </app-container>
                    </ng-container>
                `,
                providers      : [ UserListDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class UserListComponent implements OnInit {
    readonly ACTIVE_USERS_TAB_LABEL: UsersTabLabel = 'Active';
    readonly ONBOARDING_USERS_TAB_LABEL: UsersTabLabel = 'Onboarding';
    readonly INACTIVE_USERS_TAB_LABEL: UsersTabLabel = 'Inactive';

    constructor(
        public readonly dataService: UserListDataService,
        public readonly navigationService: NavigationService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
        this.dataService.loadUsers( this.tabToUserStatusesMap[this.ACTIVE_USERS_TAB_LABEL] );
    }

    onTabChange(event: MatTabChangeEvent): void {
        const statuses = this.tabToUserStatusesMap[event.tab.textLabel];
        this.dataService.loadUsers( statuses );
    }

    private get tabToUserStatusesMap(): TabToUserStatusesMap {
        return {
            [this.ACTIVE_USERS_TAB_LABEL]    : [ UserStatusEnum.Active ],
            [this.ONBOARDING_USERS_TAB_LABEL]: [ UserStatusEnum.Created, UserStatusEnum.Invited ],
            [this.INACTIVE_USERS_TAB_LABEL]  : [ UserStatusEnum.Inactive ]
        };
    }
}
