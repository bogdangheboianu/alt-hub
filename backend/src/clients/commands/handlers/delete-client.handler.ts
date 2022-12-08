import { DeleteClientCommand } from '@clients/commands/impl/delete-client.command';
import { ClientUpdatedEvent } from '@clients/events/impl/client-updated.event';
import { FailedToUpdateClientEvent } from '@clients/events/impl/failed-to-update-client.event';
import { ClientNotFoundException } from '@clients/exceptions/client.exceptions';
import { Client } from '@clients/models/domain-models/client';
import { ClientId } from '@clients/models/value-objects/client-id';
import { ClientRepository } from '@clients/repositories/client.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';

@CommandHandler( DeleteClientCommand )
export class DeleteClientHandler extends BaseSyncCommandHandler<DeleteClientCommand, Client> {
    constructor(
        private readonly clientRepository: ClientRepository,
        private readonly eventBus: EventBus
    ) {
        super();
    }

    async execute(command: DeleteClientCommand): Promise<Result<Client>> {
        const client = await this.getClientById( command );

        if( client.isFailed ) {
            return this.failed( command, ...client.errors );
        }

        await this.clientRepository.delete( client.value! );

        return this.successful( command, client.value! );
    }

    protected failed(command: DeleteClientCommand, ...errors: IException[]): Result<Client> {
        const { context } = command.data;
        const event = new FailedToUpdateClientEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    protected successful(command: DeleteClientCommand, client: Client): Result<any> {
        const { context } = command.data;
        const event = new ClientUpdatedEvent( { context, payload: client } );

        this.eventBus.publish( event );

        return Success( client );
    }

    private async getClientById(command: DeleteClientCommand): Promise<Result<Client>> {
        const clientId = ClientId.create( command.data.payload.clientId );

        if( clientId.isFailed ) {
            return Failed( ...clientId.errors );
        }

        const data = await this.clientRepository.findById( clientId.value! );

        if( data.isFailed ) {
            throw new Exception( data.errors );
        }

        if( data.isNotFound ) {
            return Failed( new ClientNotFoundException() );
        }

        return data;
    }
}
