import { Client } from '@clients/models/domain-models/client';
import { GetAllClientsQuery } from '@clients/queries/impl/get-all-clients.query';
import { ClientRepository } from '@clients/repositories/client.repository';
import { QueryHandler } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { Result } from '@shared/models/generics/result';

@QueryHandler( GetAllClientsQuery )
export class GetAllClientsHandler extends BaseQueryHandler<GetAllClientsQuery, Client[]> {
    constructor(
        private readonly clientRepository: ClientRepository
    ) {
        super();
    }

    async execute(query: GetAllClientsQuery): Promise<Result<Client[]>> {
        const clients = await this.getAllClients();

        if( clients.isFailed ) {
            return this.failed( query, ...clients.errors );
        }

        return this.successful( query, clients.value! );
    }

    protected failed(query: GetAllClientsQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    protected successful(query: GetAllClientsQuery, clients: Client[]): Result<Client[]> {
        return Success( clients );
    }

    private async getAllClients(): Promise<Result<Client[]>> {
        const clients = await this.clientRepository.findAll();

        if( clients.isFailed ) {
            throw new Exception( clients.errors );
        }

        if( clients.isNotFound ) {
            return Success( [] );
        }

        return clients;
    }
}
