import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { ClientDto } from '@dtos/client.dto';
import { IBaseEntityState } from '@shared/store/base-entity-state.interface';
import { BaseEntityStore } from '@shared/store/base-entity-store';
import { initialBaseEntityState } from '@shared/store/initial-base-entity-state.function';
import { storeEvent } from '@shared/store/store-event.decorator';

export interface ClientState extends IBaseEntityState<ClientDto> {
}

const createInitialState = (): ClientState => (
    { ...initialBaseEntityState() }
);

@Injectable()
@StoreConfig( { name: 'clients' } )
export class ClientStore extends BaseEntityStore<ClientDto, ClientState> {
    constructor() {
        super( createInitialState() );
    }

    @storeEvent( 'Client list loaded' )
    onClientListLoaded(clientList: ClientDto[]): void {
        this.set( clientList );
    }

    @storeEvent( 'Client loaded' )
    onClientLoaded(client: ClientDto): void {
        this.upsert( client.id, client );
        this.setActive( client.id );
    }

    @storeEvent( 'Client created' )
    onClientCreated(client: ClientDto): void {
        this.add( client );
    }

    @storeEvent( 'Client updated' )
    onClientUpdated(client: ClientDto): void {
        this.replace( client.id, client );
    }
}
