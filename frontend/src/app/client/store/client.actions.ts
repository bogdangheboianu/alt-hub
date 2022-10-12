import { Injectable } from '@angular/core';
import { ClientService } from '@client/services/client.service';
import { ClientSelectors } from '@client/store/client.selectors';
import { ClientStore } from '@client/store/client.store';
import { action } from '@datorama/akita';
import { CreateClientDto } from '@dtos/create-client.dto';
import { UpdateClientDto } from '@dtos/update-client.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClientActions {
    constructor(
        private clientService: ClientService,
        private clientStore: ClientStore,
        private clientSelectors: ClientSelectors
    ) {
    }

    @action( 'Load all clients' )
    loadAllClients(): void {
        firstValueFrom( this.clientService.getAllClients() )
            .then();
    }

    @action( 'Load client by id' )
    loadClientById(id: string): void {
        if( this.clientSelectors.hasEntity( id ) ) {
            return this.clientStore.setActive( id );
        }

        firstValueFrom( this.clientService.getClientById( id ) )
            .then();
    }

    @action( 'Create client' )
    createClient(data: CreateClientDto): void {
        firstValueFrom( this.clientService.createClient( data ) )
            .then();
    }

    @action( 'Update client' )
    updateClient(id: string, data: UpdateClientDto): void {
        firstValueFrom( this.clientService.updateClient( id, data ) )
            .then();
    }
}
