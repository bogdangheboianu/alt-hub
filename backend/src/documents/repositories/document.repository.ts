import { DocumentEntity } from '@documents/entities/document.entity';
import { IDocumentsSelectionCriteria } from '@documents/interfaces/documents-selection-criteria.interface';
import { Document } from '@documents/models/document';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { NotFound } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { Result } from '@shared/models/generics/result';
import { EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class DocumentRepository {
    constructor(@InjectRepository( DocumentEntity ) private readonly repository: Repository<DocumentEntity>) {
    }

    @catchAsyncExceptions()
    async findAll(selectionCriteria?: IDocumentsSelectionCriteria): Promise<Result<Document[]>> {
        let searchConditions: any = {};

        if( valueIsNotEmpty( selectionCriteria ) ) {
            const { usersIds, companiesIds, clientsIds } = selectionCriteria;

            if( valueIsNotEmpty( usersIds ) ) {
                const users_ids = usersIds.map( id => id.getValue() );
                searchConditions = { ...searchConditions, users: { id: In( users_ids ) } };
            }

            if( valueIsNotEmpty( companiesIds ) ) {
                const companies_ids = companiesIds.map( id => id.getValue() );
                searchConditions = { ...searchConditions, companies: { id: In( companies_ids ) } };
            }

            if( valueIsNotEmpty( clientsIds ) ) {
                const clients_ids = clientsIds.map( id => id.getValue() );
                searchConditions = { ...searchConditions, clients: { id: In( clients_ids ) } };
            }
        }

        const results = await this.repository.find( { where: searchConditions } );

        return valueIsEmpty( results )
               ? NotFound()
               : Result.aggregateResults( ...results.map( r => Document.fromEntity( r ) ) );
    }

    @catchAsyncExceptions()
    async save(document: Document, externalTransaction?: EntityManager): Promise<Result<Document>> {
        const entity = document.toEntity();
        const savedEntity = valueIsEmpty( externalTransaction )
                            ? await this.repository.save( entity )
                            : await externalTransaction.save( entity );

        return Document.fromEntity( savedEntity );
    }
}
