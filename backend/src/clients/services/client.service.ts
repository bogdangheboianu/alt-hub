import { CreateClientCommand } from '@clients/commands/impl/create-client.command';
import { UpdateClientCommand } from '@clients/commands/impl/update-client.command';
import { ClientDto } from '@clients/dtos/client.dto';
import { CreateClientDto } from '@clients/dtos/create-client.dto';
import { UpdateClientDto } from '@clients/dtos/update-client.dto';
import { modelsToClientDtoList, modelToClientDto } from '@clients/mappers/client.mappers';
import { Client } from '@clients/models/domain-models/client';
import { GetAllClientsQuery } from '@clients/queries/impl/get-all-clients.query';
import { GetClientByIdQuery } from '@clients/queries/impl/get-client-by-id.query';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

@Injectable()
export class ClientService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {
    }

    async createClient(context: AuthenticatedContext, data: CreateClientDto): Promise<ClientDto> {
        const validation = ValidationChain.validate<typeof data>()
                                          .isNotEmpty( data.name, 'name' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new CreateClientCommand( { context, payload: data } );
        const result: Result<Client> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToClientDto( result.value! );
    }

    async getAllClients(context: AuthenticatedContext): Promise<ClientDto[]> {
        const query = new GetAllClientsQuery( { context, params: null } );
        const result: Result<Client[]> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelsToClientDtoList( result.value! );
    }

    async getClientById(context: AuthenticatedContext, id: string): Promise<ClientDto> {
        const validation = ValidationChain.validate<any>()
                                          .isUUIDv4( id, 'id' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const query = new GetClientByIdQuery( { context, params: { id } } );
        const result: Result<Client> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToClientDto( result.value! );
    }

    async updateClient(context: AuthenticatedContext, data: UpdateClientDto, id: string): Promise<ClientDto> {
        const validation = ValidationChain.validate<any>()
                                          .isNotEmpty( data.name, 'name' )
                                          .isUUIDv4( id, 'id' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new UpdateClientCommand( { context, payload: { ...data, clientId: id } } );
        const result: Result<Client> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToClientDto( result.value! );
    }
}
