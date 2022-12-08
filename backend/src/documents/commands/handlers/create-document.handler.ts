import { Client } from '@clients/models/domain-models/client';
import { ClientId } from '@clients/models/value-objects/client-id';
import { ClientRepository } from '@clients/repositories/client.repository';
import { CompanyNotDefinedException } from '@company/exceptions/company.exceptions';
import { Company } from '@company/models/company';
import { CompanyRepository } from '@company/repositories/company.repository';
import { CreateDocumentCommand } from '@documents/commands/impl/create-document.command';
import { DocumentCreatedEvent } from '@documents/events/impl/document-created.event';
import { FailedToCreateDocumentEvent } from '@documents/events/impl/failed-to-create-document.event';
import { Document } from '@documents/models/document';
import { DocumentRepository } from '@documents/repositories/document.repository';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsString } from '@shared/functions/value-is-string.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { User } from '@users/models/user';
import { UserId } from '@users/models/user-id';
import { UserRepository } from '@users/repositories/user.repository';

@CommandHandler( CreateDocumentCommand )
export class CreateDocumentHandler extends BaseSyncCommandHandler<CreateDocumentCommand, Document> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly documentRepository: DocumentRepository,
        private readonly companyRepository: CompanyRepository,
        private readonly userRepository: UserRepository,
        private readonly clientRepository: ClientRepository
    ) {
        super();
    }

    async execute(command: CreateDocumentCommand): Promise<Result<Document>> {
        const masterCompanyPromise = this.getMasterCompany();
        const usersPromise = this.getUsers( command );
        const clientsPromise = this.getClients( command );

        const masterCompany = await masterCompanyPromise;
        const users = await usersPromise;
        const clients = await clientsPromise;

        if( masterCompany.isFailed ) {
            return this.failed( command, ...masterCompany.errors );
        }

        if( users.isFailed ) {
            return this.failed( command, ...users.errors );
        }

        if( clients.isFailed ) {
            return this.failed( command, ...clients.errors );
        }

        const document = Document.create( command, [ masterCompany.value! ], users.value!, clients.value! );

        if( document.isFailed ) {
            return this.failed( command, ...document.errors );
        }

        const savedDocument = await this.saveDocumentToDb( document.value! );

        return this.successful( command, savedDocument );
    }

    protected failed(command: CreateDocumentCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToCreateDocumentEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    protected successful(command: CreateDocumentCommand, document: Document): Result<Document> {
        const { context } = command.data;
        const event = new DocumentCreatedEvent( { context, payload: document } );

        this.eventBus.publish( event );

        return Success( document );
    }

    private async getMasterCompany(): Promise<Result<Company>> {
        const company = await this.companyRepository.get();

        if( company.isFailed ) {
            throw new Exception( company.errors );
        }

        if( company.isNotFound ) {
            return Failed( new CompanyNotDefinedException() );
        }

        return company;
    }

    private async getUsers(command: CreateDocumentCommand): Promise<Result<User[] | undefined>> {
        const { payload: { usersIds: ids } } = command.data;

        if( valueIsEmpty( ids ) ) {
            return Success( undefined );
        }

        const usersIds = Result.aggregateResults( ...(
            valueIsString( ids )
            ? ids.split( ',' )
            : ids
        )
            .map( id => UserId.create( id ) ) );

        if( usersIds.isFailed ) {
            return Failed( ...usersIds.errors );
        }

        const users = await this.userRepository.findAllActiveByIdList( usersIds.value! );

        if( users.isFailed ) {
            throw new Exception( users.errors );
        }

        if( users.isNotFound ) {
            return Success( undefined );
        }

        return users;
    }

    private async getClients(command: CreateDocumentCommand): Promise<Result<Client[] | undefined>> {
        const { payload: { clientsIds: ids } } = command.data;

        if( valueIsEmpty( ids ) ) {
            return Success( undefined );
        }

        const clientsIds = Result.aggregateResults( ...(
            valueIsString( ids )
            ? ids.split( ',' )
            : ids
        )
            .map( id => ClientId.create( id ) ) );

        if( clientsIds.isFailed ) {
            return Failed( ...clientsIds.errors );
        }

        const clients = await this.clientRepository.findAllByIdList( clientsIds.value! );

        if( clients.isFailed ) {
            throw new Exception( clients.errors );
        }

        if( clients.isNotFound ) {
            return Success( undefined );
        }

        return clients;
    }

    private async saveDocumentToDb(document: Document): Promise<Document> {
        const savedDocument = await this.documentRepository.save( document );

        if( savedDocument.isFailed ) {
            throw new Exception( savedDocument.errors );
        }

        return savedDocument.value!;
    }
}
