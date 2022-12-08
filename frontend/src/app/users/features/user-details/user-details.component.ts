import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserStatusEnum } from '@dtos/user-status-enum';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { MessageService } from '@shared/features/message/message.service';
import { DropdownMenuItems } from '@shared/ui/dropdown-menu.component';
import { UserSuccessMessage } from '@users/config/user.constants';
import { UserDetailsDataService } from '@users/features/user-details/user-details-data.service';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector       : 'app-user-details',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <app-loading-bar [visible]="data.loading"></app-loading-bar>
                        <ng-container *ngIf="data.entity as user">
                            <app-user-details-header
                                [user]="user"
                                [loading]="data.loading"
                                [menuItems]="userMenuItems"></app-user-details-header>
                            <app-user-onboarding-steps></app-user-onboarding-steps>
                            <main class="row">
                                <section class="col-4">
                                    <app-user-info></app-user-info>
                                </section>
                                <section class="col-8">
                                    <app-user-details-tabs></app-user-details-tabs>
                                </section>
                            </main>
                        </ng-container>
                    </ng-container>
                `,
                providers      : [ UserDetailsDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class UserDetailsComponent implements OnInit {
    userMenuItems: DropdownMenuItems = [];

    constructor(
        public readonly dataService: UserDetailsDataService,
        private readonly messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
        this.populateUserMenuItems();
    }

    private deactivateUser(): void {
        this.dataService.deactivateUser();
        this.onUserDeactivateSuccess();
    }

    private reactivateUser(): void {
        this.dataService.reactivateUser();
        this.onUserReactivateSuccess();
    }

    private onUserReactivateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.messageService.success( UserSuccessMessage.Activated );
        } );
    }

    private onUserDeactivateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.messageService.success( UserSuccessMessage.Deactivated );
        } );
    }

    private populateUserMenuItems(): void {
        this.dataService.entity$
            .subscribe( user => {
                this.userMenuItems = [];
                if( user.account.status === UserStatusEnum.Active ) {
                    this.userMenuItems.push( {
                                                 text   : 'Deactivate',
                                                 icon   : 'delete_outline',
                                                 color  : 'warn',
                                                 command: this.deactivateUser.bind( this )
                                             } );

                } else {
                    this.userMenuItems.push( {
                                                 text   : 'Activate',
                                                 icon   : 'info',
                                                 color  : 'default',
                                                 command: this.reactivateUser.bind( this )
                                             } );
                }
            } );
    }
}
