import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ClientSuccessMessage } from '@clients/config/client.constants';
import { ClientCreateDataService } from '@clients/features/client-create/client-create-data.service';
import { CreateClientDto } from '@dtos/create-client-dto';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { MessageService } from '@shared/features/message/message.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector       : 'app-client-create',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <app-header>
                            <app-title headerLeft title="Add new client"></app-title>
                        </app-header>
                        <app-container>
                            <div class="row">
                                <div class="col-4">
                                    <app-client-create-form [loading]="data.loading"
                                                            (onSubmit)="createClient($event)"></app-client-create-form>
                                </div>
                            </div>
                        </app-container>
                    </ng-container>
                `,
                providers      : [ ClientCreateDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ClientCreateComponent implements OnInit {
    constructor(
        public readonly dataService: ClientCreateDataService,
        private readonly navigationService: NavigationService,
        private readonly messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    createClient(data: CreateClientDto): void {
        this.dataService.create( data );
        this.onClientCreateSuccess();
    }

    private onClientCreateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.navigationService.clientList();
            this.messageService.success( ClientSuccessMessage.Created );
        } );
    }
}
