import { Injectable } from '@angular/core';
import { ClientStore } from '@clients/data/client.store';
import { ClientDto } from '@dtos/client-dto';
import { CreateClientDto } from '@dtos/create-client-dto';
import { DeletedEntityResponseDto } from '@dtos/deleted-entity-response-dto';
import { UpdateClientDto } from '@dtos/update-client-dto';
import { apiRoutes } from '@shared/api/api.routes';
import { ApiResult } from '@shared/api/api-result';
import { ApiService } from '@shared/api/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class ClientApiService extends ApiService {
    constructor(private readonly clientStore: ClientStore) {
        super( clientStore );
    }

    getAllClients(): Observable<ApiResult<ClientDto[]>> {
        return this.get( apiRoutes.clients.base, this.clientStore.onClientListLoaded.bind( this.clientStore ) );
    }

    getClientById(id: string): Observable<ApiResult<ClientDto>> {
        return this.get( `${ apiRoutes.clients.base }/${ id }`, this.clientStore.onClientLoaded.bind( this.clientStore ) );
    }

    createClient(data: CreateClientDto): Observable<ApiResult<ClientDto>> {
        return this.post( apiRoutes.clients.base, data, this.clientStore.onClientCreated.bind( this.clientStore ) );
    }

    updateClient(id: string, data: UpdateClientDto): Observable<ApiResult<ClientDto>> {
        return this.put( `${ apiRoutes.clients.base }/${ id }`, data, this.clientStore.onClientUpdated.bind( this.clientStore ) );
    }

    deleteClient(id: string): Observable<ApiResult<DeletedEntityResponseDto>> {
        return this.delete( `${ apiRoutes.clients.base }/${ id }`, this.clientStore.onClientDeleted.bind( this.clientStore ) );
    }
}
