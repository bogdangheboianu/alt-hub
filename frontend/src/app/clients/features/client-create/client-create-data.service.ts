import { Injectable } from '@angular/core';
import { ClientActions } from '@clients/data/client.actions';
import { ClientSelectors } from '@clients/data/client.selectors';
import { CreateClientDto } from '@dtos/create-client-dto';
import { BaseComponentDataService, ComponentDataSource } from '@shared/data/base-component-data.service';

@Injectable()
export class ClientCreateDataService extends BaseComponentDataService<{}> {
    constructor(
        private readonly clientActions: ClientActions,
        private readonly clientSelectors: ClientSelectors
    ) {
        super( clientSelectors );
    }

    override onInit(): void {
    }

    create(data: CreateClientDto): void {
        this.clientActions.createClient( data );
    }

    protected override dataSource(): ComponentDataSource<{}> {
        return {};
    }
}
