import { Injectable } from '@angular/core';
import { clientsToSelectInputOptions } from '@clients/config/client.mappers';
import { ClientState, ClientStore } from '@clients/data/client.store';
import { BaseEntitySelector } from '@config/store/store.models';
import { ClientDto } from '@dtos/client-dto';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';
import { map, Observable } from 'rxjs';

@Injectable()
export class ClientSelectors extends BaseEntitySelector<ClientDto, ClientState> {
    constructor(private clientStore: ClientStore) {
        super( clientStore );
    }

    selectAllAsSelectInputOptions(): Observable<SelectInputOptions> {
        return this.selectAll()
                   .pipe( map( clientsToSelectInputOptions ) );
    }
}
