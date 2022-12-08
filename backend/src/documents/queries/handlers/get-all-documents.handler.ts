import { ClientId } from '@clients/models/value-objects/client-id';
import { CompanyId } from '@company/models/company-id';
import { GetAllDocumentsParamsDto } from '@documents/dtos/get-all-documents-params.dto';
import { IDocumentsSelectionCriteria } from '@documents/interfaces/documents-selection-criteria.interface';
import { Document } from '@documents/models/document';
import { GetAllDocumentsQuery } from '@documents/queries/impl/get-all-documents.query';
import { DocumentRepository } from '@documents/repositories/document.repository';
import { QueryHandler } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { Result } from '@shared/models/generics/result';
import { UserId } from '@users/models/user-id';

@QueryHandler( GetAllDocumentsQuery )
export class GetAllDocumentsHandler extends BaseQueryHandler<GetAllDocumentsQuery, Document[]> {
    constructor(
        private readonly documentRepository: DocumentRepository
    ) {
        super();
    }

    async execute(query: GetAllDocumentsQuery): Promise<Result<Document[]>> {
        const documents = await this.getAllDocuments( query );

        if( documents.isFailed ) {
            return this.failed( query, ...documents.errors );
        }

        return this.successful( query, documents.value! );
    }

    protected failed(query: GetAllDocumentsQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    protected successful(query: GetAllDocumentsQuery, documents: Document[]): Result<Document[]> {
        return Success( documents );
    }

    private async getAllDocuments(query: GetAllDocumentsQuery): Promise<Result<Document[]>> {
        const { params } = query.data;
        const selectionCriteria = this.buildDocumentsSelectionCriteria( params );

        if( selectionCriteria.isFailed ) {
            return Failed( ...selectionCriteria.errors );
        }

        const documents = await this.documentRepository.findAll( selectionCriteria.value! );

        if( documents.isFailed ) {
            throw new Exception( documents.errors );
        }

        if( documents.isNotFound ) {
            return Success( [] );
        }

        return documents;
    }

    private buildDocumentsSelectionCriteria(params: GetAllDocumentsParamsDto): Result<IDocumentsSelectionCriteria> {
        return Result.aggregateObjects<IDocumentsSelectionCriteria>(
            {
                companiesIds: valueIsEmpty( params.companiesIds )
                              ? Success( undefined )
                              : Result.aggregateResults( ...params.companiesIds!.map( id => CompanyId.create( id ) ) )
            },
            {
                usersIds: valueIsEmpty( params.usersIds )
                          ? Success( undefined )
                          : Result.aggregateResults( ...params.usersIds!.map( id => UserId.create( id ) ) )
            },
            {
                clientsIds: valueIsEmpty( params.clientsIds )
                            ? Success( undefined )
                            : Result.aggregateResults( ...params.clientsIds!.map( id => ClientId.create( id ) ) )
            }
        );
    }
}
