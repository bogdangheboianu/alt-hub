import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateClientFormComponent } from '@client/components/create-client-form/create-client-form.component';

@Component({
  selector: 'app-company-clients-tab',
  templateUrl: './company-clients-tab.component.html',
  styleUrls: [ './company-clients-tab.component.scss']
})
export class CompanyClientsTabComponent {
    constructor(
        private dialog: MatDialog
    ) {
    }

    openCreateClientModal(): void {
        this.dialog.open( CreateClientFormComponent, { width: '400px' } );
    }
}
