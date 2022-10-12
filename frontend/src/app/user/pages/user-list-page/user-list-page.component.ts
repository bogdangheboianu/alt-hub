import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserStatusEnum } from '@dtos/user-status.enum';
import { CreateUserStepperComponent } from '@user/components/create-user-stepper/create-user-stepper.component';
import { UserActions } from '@user/store/user.actions';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector   : 'app-user-list-page',
                templateUrl: './user-list-page.component.html',
                styleUrls  : [ './user-list-page.component.scss' ]
            } )
@UntilDestroy()
export class UserListPageComponent implements OnInit {
    readonly ACTIVE_USERS_TAB_LABEL = 'Active';
    readonly ONBOARDING_USERS_TAB_LABEL = 'Onboarding';
    readonly INACTIVE_USERS_TAB_LABEL = 'Inactive';

    constructor(
        private readonly userActions: UserActions,
        private readonly dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.loadAllUsers( this.tabToUserStatusesMap[this.ACTIVE_USERS_TAB_LABEL] );
    }

    openCreateUserDialog(): void {
        this.dialog.open( CreateUserStepperComponent, { width: '80%' } );
    }

    onTabChange(event: MatTabChangeEvent): void {
        const statuses = this.tabToUserStatusesMap[event.tab.textLabel];
        this.loadAllUsers( statuses );
    }

    private loadAllUsers(statuses: UserStatusEnum[]): void {
        this.userActions.loadAllUsers( { statuses } );
    }

    private get tabToUserStatusesMap(): { [tabLabel: string]: UserStatusEnum[] } {
        return {
            [this.ACTIVE_USERS_TAB_LABEL]    : [ UserStatusEnum.Active ],
            [this.ONBOARDING_USERS_TAB_LABEL]: [ UserStatusEnum.Created, UserStatusEnum.Invited, UserStatusEnum.Confirmed ],
            [this.INACTIVE_USERS_TAB_LABEL]  : [ UserStatusEnum.Inactive ]
        };
    }
}
