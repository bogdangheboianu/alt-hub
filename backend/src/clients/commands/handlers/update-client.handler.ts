import { UpdateClientCommand } from '@clients/commands/impl/update-client.command';
import { ClientUpdatedEvent } from '@clients/events/impl/client-updated.event';
import { FailedToUpdateClientEvent } from '@clients/events/impl/failed-to-update-client.event';
import { ClientNotFoundException, DuplicateClientNameException } from '@clients/exceptions/client.exceptions';
import { Client } from '@clients/models/domain-models/client';
import { ClientId } from '@clients/models/value-objects/client-id';
import { ClientName } from '@clients/models/value-objects/client-name';
import { ClientRepository } from '@clients/repositories/client.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';

@CommandHandler( UpdateClientCommand )
export class UpdateClientHandler extends BaseSyncCommandHandler<UpdateClientCommand, Client> {

    constructor(private readonly clientRepository: ClientRepository,
                private readonly eventBus: EventBus) {
        super();
    }

    async execute(command: UpdateClientCommand): Promise<Result<Client>> {
        const existingClient = await this.getClientById( command );

        if( existingClient.isFailed ) {
            return this.failed( command, ...existingClient.errors );
        }

        const clientNameUniquenessCheck = await this.checkForClientNameUniqueness( command, existingClient.value! );

        if( clientNameUniquenessCheck.isFailed ) {
            return this.failed( command, ...clientNameUniquenessCheck.errors );
        }

        const updatedClient: Result<Client> = existingClient.value!.updateClient( command );

        if( updatedClient.isFailed ) {
            return this.failed( command, ...updatedClient.errors );
        }

        const savedClient = await this.saveClientToDb( updatedClient.value! );

        return this.successful( command, savedClient );
    }

    protected failed(command: UpdateClientCommand, ...errors: IException[]): Result<Client> {
        const { context } = command.data;
        const event = new FailedToUpdateClientEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    protected successful(command: UpdateClientCommand, client: Client): Result<any> {
        const { context } = command.data;
        const event = new ClientUpdatedEvent( { context, payload: client } );

        this.eventBus.publish( event );

        return Success( client );
    }

    private async checkForClientNameUniqueness(command: UpdateClientCommand, existingClient: Client): Promise<Result<any>> {
        const { payload: { name } } = command.data;
        const clientName = ClientName.create( name );

        if( clientName.isFailed ) {
            return Failed( ...clientName.errors );
        }

        const client = await this.clientRepository.findClientByName( clientName.value! );

        if( client.isFailed ) {
            throw new Exception( client.errors );
        }

        if( client.isNotFound || existingClient.id.equals( client.value!.id ) ) {
            return Success();
        }

        return Failed( new DuplicateClientNameException() );
    }

    private async getClientById(command: UpdateClientCommand): Promise<Result<Client>> {
        const clientId = ClientId.create( command.data.payload.clientId );

        if( clientId.isFailed ) {
            return Failed( ...clientId.errors );
        }

        const data = await this.clientRepository.findClientById( clientId.value! );

        if( data.isFailed ) {
            throw new Exception( data.errors );
        }

        if( data.isNotFound ) {
            return Failed( new ClientNotFoundException() );
        }

        return data;
    }

    private async saveClientToDb(client: Client): Promise<Client> {
        return await this.clientRepository.saveClient( client );
    }
}
