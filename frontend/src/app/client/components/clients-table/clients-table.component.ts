import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpdateClientFormComponent } from '@client/components/update-client-form/update-client-form.component';
import { ClientSelectors } from '@client/store/client.selectors';
import { ClientState } from '@client/store/client.store';
import { ClientDto } from '@dtos/client.dto';
import { BaseTable, TableColumns } from '@shared/directives/base-table.directive';

@Component( {
                selector   : 'app-clients-table',
                templateUrl: './clients-table.component.html',
                styleUrls  : [ './clients-table.component.scss' ]
            } )
export class ClientsTableComponent extends BaseTable<ClientDto, ClientState> {
    constructor(
        private clientSelectors: ClientSelectors,
        private dialog: MatDialog
    ) {
        super( clientSelectors );
    }

    override get columns(): TableColumns<ClientDto> {
        return [ 'name', 'audit.createdAt', 'actions' ];
    }

    openUpdateClientModal(client: ClientDto): void {
        this.dialog.open( UpdateClientFormComponent, { width: '400px', data: { client } } );
    }
}
