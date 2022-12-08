import { Client } from '@clients/models/domain-models/client';
import { Company } from '@company/models/company';
import { CreateDocumentCommand } from '@documents/commands/impl/create-document.command';
import { DocumentEntity } from '@documents/entities/document.entity';
import { IDocument } from '@documents/interfaces/document.interface';
import { DocumentId } from '@documents/models/document-id';
import { DocumentType } from '@documents/models/document-type';
import { File } from '@files/models/file';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { Result } from '@shared/models/generics/result';
import { User } from '@users/models/user';

export class Document implements IDomainModel<Document, DocumentEntity> {
    id: DocumentId;
    type: DocumentType;
    files: File[];
    companies: Company[];
    clients: Client[];
    users: User[];
    audit: Audit;

    private constructor(data: IDocument) {
        this.id = data.id ?? DocumentId.generate();
        this.type = data.type;
        this.files = data.files ?? [];
        this.companies = data.companies ?? [];
        this.clients = data.clients ?? [];
        this.users = data.users ?? [];
        this.audit = data.audit ?? Audit.initial();
    }

    static create(command: CreateDocumentCommand, companies: Company[], users?: User[], clients?: Client[]): Result<Document> {
        const { payload, context } = command.data;
        const data = Result.aggregateObjects<Omit<IDocument, 'id'>>(
            { type: DocumentType.create( payload.type ) },
            { files: Result.aggregateResults( ...payload.files.map( file => File.create( command, file ) ) ) },
            { companies },
            { users },
            { clients },
            { audit: Audit.initial( context.user.id ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new Document( data.value! ) );
    }

    static fromEntity(entity: DocumentEntity): Result<Document> {
        const data = Result.aggregateObjects<IDocument>(
            { id: DocumentId.create( entity.id ) },
            { type: DocumentType.create( entity.type ) },
            { files: Result.aggregateResults( ...entity.files.map( file => File.fromEntity( file ) ) ) },
            { companies: Result.aggregateResults( ...entity.companies.map( company => Company.fromEntity( company ) ) ) },
            { users: Result.aggregateResults( ...entity.users.map( user => User.fromEntity( user ) ) ) },
            { clients: Result.aggregateResults( ...entity.clients.map( client => Client.fromEntity( client ) ) ) },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new Document( data.value! ) );
    }

    equals(to: Document): boolean {
        return this.id.equals( to.id );
    }

    toEntity(): DocumentEntity {
        return entityFactory( DocumentEntity, {
            id       : this.id.getValue(),
            type     : this.type.getValue(),
            files    : this.files.map( file => file.toEntity() ),
            companies: this.companies.map( company => company.toEntity() ),
            clients  : this.clients.map( client => client.toEntity() ),
            users    : this.users.map( user => user.toEntity() ),
            audit    : this.audit.toEntity()
        } );
    }
}
