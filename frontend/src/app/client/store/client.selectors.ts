import { Injectable } from '@angular/core';
import { ClientState, ClientStore } from '@client/store/client.store';
import { ClientDto } from '@dtos/client.dto';
import { BaseEntitySelector } from '@shared/store/base-entity-selector';

@Injectable()
export class ClientSelectors extends BaseEntitySelector<ClientDto, ClientState> {
    constructor(private clientStore: ClientStore) {
        super( clientStore );
    }
}
