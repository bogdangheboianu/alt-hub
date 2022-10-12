import { ClientNotFoundException } from '@clients/exceptions/client.exceptions';
import { Client } from '@clients/models/domain-models/client';
import { ClientId } from '@clients/models/value-objects/client-id';
import { GetClientByIdQuery } from '@clients/queries/impl/get-client-by-id.query';
import { ClientRepository } from '@clients/repositories/client.repository';
import { QueryHandler } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { Result } from '@shared/models/generics/result';

@QueryHandler( GetClientByIdQuery )
export class GetClientByIdHandler extends BaseQueryHandler<GetClientByIdQuery, Client> {
    constructor(
        private readonly clientRepository: ClientRepository
    ) {
        super();
    }

    async execute(query: GetClientByIdQuery): Promise<Result<Client>> {
        const client = await this.getClientById( query );

        if( client.isFailed ) {
            return this.failed( query, ...client.errors );
        }

        return this.successful( query, client.value! );
    }

    protected failed(query: GetClientByIdQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    protected successful(query: GetClientByIdQuery, client: Client): Result<Client> {
        return Success( client );
    }

    private async getClientById(query: GetClientByIdQuery): Promise<Result<Client>> {
        const id = ClientId.create( query.data.params.id );

        if( id.isFailed ) {
            return Failed( ...id.errors );
        }

        const client = await this.clientRepository.findClientById( id.value! );

        if( client.isFailed ) {
            throw new Exception( client.errors );
        }

        if( client.isNotFound ) {
            return Failed( new ClientNotFoundException() );
        }

        return client;
    }
}
