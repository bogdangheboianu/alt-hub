import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { ClientDto } from '@dtos/client-dto';
import { DeletedEntityResponseDto } from '@dtos/deleted-entity-response-dto';
import { IBaseEntityState } from '@config/store/store.interfaces';
import { BaseEntityStore } from '@config/store/store.models';
import { initialBaseEntityState } from '@config/store/store.functions';
import { storeEvent } from '@config/store/store.decorators';
import { StoreNameEnum } from '@config/store/store.constants';

export interface ClientState extends IBaseEntityState<ClientDto> {
}

const createInitialState = (): ClientState => (
    { ...initialBaseEntityState() }
);

@Injectable()
@StoreConfig( { name: StoreNameEnum.Clients } )
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

    @storeEvent( 'Client deleted' )
    onClientDeleted(data: DeletedEntityResponseDto): void {
        this.remove( data.deletedId );
    }
}
