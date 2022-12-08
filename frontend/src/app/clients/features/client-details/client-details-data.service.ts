import { Injectable } from '@angular/core';
import { ClientActions } from '@clients/data/client.actions';
import { ClientSelectors } from '@clients/data/client.selectors';
import { ClientDto } from '@dtos/client-dto';
import { UpdateClientDto } from '@dtos/update-client-dto';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';

@Injectable()
export class ClientDetailsDataService extends DetailsComponentDataService<ClientDto, {}> {
    constructor(
        private readonly clientActions: ClientActions,
        private readonly clientSelectors: ClientSelectors
    ) {
        super( clientSelectors );
    }

    override onInit(): void {
        this.loadClient();
    }

    updateClient(data: UpdateClientDto): void {
        this.entity.then( client => this.clientActions.updateClient( client.id, data ) );
    }

    deleteClient(): void {
        this.entity.then( client => this.clientActions.deleteClient( client.id ) );
    }

    protected override dataSource(): ComponentDataSource<{}> {
        return {};
    }

    private loadClient(): void {
        this.getIdFromRoute()
            .subscribe( id => this.clientActions.loadClientById( id ) );
    }
}
