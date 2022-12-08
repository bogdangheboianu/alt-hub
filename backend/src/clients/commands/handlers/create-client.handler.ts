import { CreateClientCommand } from '@clients/commands/impl/create-client.command';
import { ClientCreatedEvent } from '@clients/events/impl/client-created.event';
import { FailedToCreateClientEvent } from '@clients/events/impl/failed-to-create-client.event';
import { DuplicateClientNameException } from '@clients/exceptions/client.exceptions';
import { Client } from '@clients/models/domain-models/client';
import { ClientRepository } from '@clients/repositories/client.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';

@CommandHandler( CreateClientCommand )
export class CreateClientHandler extends BaseSyncCommandHandler<CreateClientCommand, Client> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly clientRepository: ClientRepository
    ) {
        super();
    }

    async execute(command: CreateClientCommand): Promise<Result<Client>> {
        const client = Client.create( command );

        if( client.isFailed ) {
            return this.failed( command, ...client.errors );
        }

        const clientNameUniquenessCheck = await this.checkForClientNameUniqueness( client.value! );

        if( clientNameUniquenessCheck.isFailed ) {
            return this.failed( command, ...clientNameUniquenessCheck.errors );
        }

        const savedClient = await this.saveClientToDb( client.value! );

        return this.successful( command, savedClient );
    }

    protected successful(command: CreateClientCommand, client: Client): Result<Client> {
        const { context } = command.data;
        const event = new ClientCreatedEvent( { context, payload: client } );

        this.eventBus.publish( event );

        return Success( client );
    }

    protected failed(command: CreateClientCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToCreateClientEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async checkForClientNameUniqueness(client: Client): Promise<Result<any>> {
        const existingClient = await this.clientRepository.findByName( client.name );

        if( existingClient.isFailed ) {
            throw new Exception( existingClient.errors );
        }

        if( existingClient.isNotFound ) {
            return Success();
        }

        return Failed( new DuplicateClientNameException() );
    }

    private async saveClientToDb(client: Client): Promise<Client> {
        const savedClient = await this.clientRepository.save( client );

        if( savedClient.isFailed ) {
            throw new Exception( savedClient.errors );
        }

        return savedClient.value!;
    }
}
