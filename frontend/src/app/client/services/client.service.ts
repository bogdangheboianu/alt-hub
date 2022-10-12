import { Injectable } from '@angular/core';
import { apiRoutes } from '@shared/constants/api.routes';
import { ApiResult } from '@shared/models/api-result';
import { ApiService } from '@shared/services/api.service';
import { ClientStore } from '@client/store/client.store';
import { ClientDto } from '@dtos/client.dto';
import { CreateClientDto } from '@dtos/create-client.dto';
import { UpdateClientDto } from '@dtos/update-client.dto';
import { Observable } from 'rxjs';

@Injectable()
export class ClientService extends ApiService {
    constructor(private readonly clientStore: ClientStore) {
        super( clientStore );
    }

    getAllClients(): Observable<ApiResult<ClientDto[]>> {
        return this.get( apiRoutes.clients, this.clientStore.onClientListLoaded.bind( this.clientStore ) );
    }

    getClientById(id: string): Observable<ApiResult<ClientDto>> {
        return this.get( `${ apiRoutes.clients }/${ id }`, this.clientStore.onClientLoaded.bind( this.clientStore ) );
    }

    createClient(data: CreateClientDto): Observable<ApiResult<ClientDto>> {
        return this.post( apiRoutes.clients, data, this.clientStore.onClientCreated.bind( this.clientStore ) );
    }

    updateClient(id: string, data: UpdateClientDto): Observable<ApiResult<ClientDto>> {
        return this.put( `${ apiRoutes.clients }/${ id }`, data, this.clientStore.onClientUpdated.bind( this.clientStore ) );
    }
}
