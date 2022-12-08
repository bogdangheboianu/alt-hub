import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ClientSuccessMessage } from '@clients/config/client.constants';
import { ClientUpdateFormModalData } from '@clients/config/client.interfaces';
import { ClientDetailsDataService } from '@clients/features/client-details/client-details-data.service';
import { ClientUpdateFormComponent } from '@clients/ui/client-update-form.component';
import { UpdateClientDto } from '@dtos/update-client-dto';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { MessageService } from '@shared/features/message/message.service';
import { ModalService } from '@shared/features/modal/modal.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { DropdownMenuItems } from '@shared/ui/dropdown-menu.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector       : 'app-client-details',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <app-loading-bar [visible]="data.loading"></app-loading-bar>
                        <ng-container *ngIf="data.entity as client">
                            <app-header>
                                <app-title headerLeft [title]="client.name"></app-title>
                                <app-dropdown-menu headerRight
                                                   *isAdmin
                                                   [menuItems]="clientMenuItems"></app-dropdown-menu>
                            </app-header>
                            <app-client-details-tabs></app-client-details-tabs>
                        </ng-container>
                    </ng-container>
                `,
                providers      : [ ClientDetailsDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ClientDetailsComponent implements OnInit {
    clientMenuItems: DropdownMenuItems;

    constructor(
        public readonly dataService: ClientDetailsDataService,
        private readonly messageService: MessageService,
        private readonly navigationService: NavigationService,
        private readonly modalService: ModalService
    ) {
        this.clientMenuItems = this.getClientMenuItems();
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    updateClient(data: UpdateClientDto): void {
        this.dataService.updateClient( data );
        this.onClientUpdateSuccess();
    }

    deleteClient(): void {
        this.dataService.deleteClient();
        this.onClientDeleteSuccess();
    }

    closeClientUpdateModal(): void {
        this.modalService.close( ClientUpdateFormComponent );
    }

    private onClientUpdateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.messageService.success( ClientSuccessMessage.Updated );
            this.closeClientUpdateModal();
        } );
    }

    private onClientDeleteSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.messageService.success( ClientSuccessMessage.Deleted );
            this.navigationService.clientList();
        } );
    }

    private openClientUpdateForm(): void {
        this.dataService.entity
            .then( client =>
                       this.modalService.openSmModal<ClientUpdateFormModalData>( ClientUpdateFormComponent, this, {
                           client,
                           loading$: this.dataService.source!.loading,
                           onSubmit: this.updateClient.bind( this ),
                           onCancel: this.closeClientUpdateModal.bind( this )
                       } ) );
    }

    private getClientMenuItems(): DropdownMenuItems {
        return [
            {
                text   : 'Edit',
                icon   : 'edit',
                color  : 'default',
                command: () => this.openClientUpdateForm()
            },
            {
                text   : 'Delete',
                icon   : 'delete_outline',
                color  : 'warn',
                command: () => this.deleteClient()
            }
        ];
    }
}
