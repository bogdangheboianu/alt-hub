import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateClientFormComponent } from '@client/components/create-client-form/create-client-form.component';
import { ClientActions } from '@client/store/client.actions';

@Component( {
                selector   : 'app-client-list-page',
                templateUrl: './client-list-page.component.html',
                styleUrls  : [ './client-list-page.component.scss' ]
            } )
export class ClientListPageComponent implements OnInit {
    constructor(
        private dialog: MatDialog,
        private clientActions: ClientActions
    ) {
    }

    ngOnInit(): void {
        this.clientActions.loadAllClients();
    }

    openCreateClientModal(): void {
        this.dialog.open( CreateClientFormComponent, { width: '400px' } );
    }
}
