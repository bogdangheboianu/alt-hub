import { Injectable } from '@angular/core';
import { ClientApiService } from '@clients/data/client-api.service';
import { ClientSelectors } from '@clients/data/client.selectors';
import { ClientStore } from '@clients/data/client.store';
import { action } from '@datorama/akita';
import { CreateClientDto } from '@dtos/create-client-dto';
import { UpdateClientDto } from '@dtos/update-client-dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClientActions {
    constructor(
        private clientApiService: ClientApiService,
        private clientStore: ClientStore,
        private clientSelectors: ClientSelectors
    ) {
    }

    @action( 'Load all clients' )
    loadAllClients(): void {
        firstValueFrom( this.clientApiService.getAllClients() )
            .then();
    }

    @action( 'Load client by id' )
    loadClientById(id: string): void {
        if( this.clientSelectors.hasEntity( id ) ) {
            return this.clientStore.setActive( id );
        }

        firstValueFrom( this.clientApiService.getClientById( id ) )
            .then();
    }

    @action( 'Create client' )
    createClient(data: CreateClientDto): void {
        firstValueFrom( this.clientApiService.createClient( data ) )
            .then();
    }

    @action( 'Update client' )
    updateClient(id: string, data: UpdateClientDto): void {
        firstValueFrom( this.clientApiService.updateClient( id, data ) )
            .then();
    }

    @action( 'Delete client' )
    deleteClient(id: string): void {
        firstValueFrom( this.clientApiService.deleteClient( id ) )
            .then();
    }
}
