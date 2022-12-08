import { Injectable } from '@angular/core';
import { ClientActions } from '@clients/data/client.actions';
import { ClientSelectors } from '@clients/data/client.selectors';
import { ClientDto } from '@dtos/client-dto';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { ListComponentDataService } from '@shared/data/list-component-data.service';

@Injectable()
export class ClientListDataService extends ListComponentDataService<ClientDto, {}> {
    constructor(
        private readonly clientActions: ClientActions,
        private readonly clientSelectors: ClientSelectors
    ) {
        super( clientSelectors);
    }

    override onInit(): void {
        this.loadClients();
    }

    protected override dataSource(): ComponentDataSource<{}> {
        return {}
    }

    private loadClients(): void {
        this.clientActions.loadAllClients();
    }
}
