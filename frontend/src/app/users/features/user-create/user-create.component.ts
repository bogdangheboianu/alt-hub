import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateUserDto } from '@dtos/create-user-dto';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { MessageService } from '@shared/features/message/message.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { UserSuccessMessage } from '@users/config/user.constants';
import { UserCreateDataService } from '@users/features/user-create/user-create-data.service';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector       : 'app-user-create',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <app-header>
                            <app-title headerLeft title="Add new employee"></app-title>
                        </app-header>
                        <app-container>
                            <app-user-create-form [loading]="data.loading"
                                                  [companyPositionOptions]="data.companyPositionOptions"
                                                  [companyPositionOptionsLoading]="data.companyPositionOptionsLoading"
                                                  (onSubmit)="createUser($event)"></app-user-create-form>
                        </app-container>
                    </ng-container>
                `,
                providers      : [ UserCreateDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class UserCreateComponent {
    constructor(
        public readonly dataService: UserCreateDataService,
        private readonly navigationService: NavigationService,
        private readonly messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    createUser(data: CreateUserDto): void {
        this.dataService.create( data );
        this.onUserCreateSuccess();
    }

    private onUserCreateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.navigationService.userList();
            this.messageService.success( UserSuccessMessage.Created );
        } );
    }
}
