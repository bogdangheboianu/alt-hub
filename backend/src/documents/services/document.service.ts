import { CreateDocumentCommand } from '@documents/commands/impl/create-document.command';
import { CreateDocumentDto } from '@documents/dtos/create-document.dto';
import { DocumentDto } from '@documents/dtos/document.dto';
import { GetAllDocumentsParamsDto } from '@documents/dtos/get-all-documents-params.dto';
import { modelsToDocumentDtoList, modelToDocumentDto } from '@documents/mappers/document.mappers';
import { Document } from '@documents/models/document';
import { GetAllDocumentsQuery } from '@documents/queries/impl/get-all-documents.query';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import { Express } from 'express';

@Injectable()
export class DocumentService {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus
    ) {
    }

    async createDocument(context: AuthenticatedContext, payload: CreateDocumentDto, files: Array<Express.Multer.File>): Promise<DocumentDto> {
        const validation = ValidationChain.validate<typeof payload & { files: Array<Express.Multer.File> }>()
                                          .isNotEmpty( payload.type, 'type' )
                                          .isNotEmpty( files, 'files' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new CreateDocumentCommand( { context, payload: { ...payload, files } } );
        const result: Result<Document> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToDocumentDto( result.value! );
    }

    async getAllDocuments(context: AuthenticatedContext, params: GetAllDocumentsParamsDto): Promise<DocumentDto[]> {
        const loggedUserIsAdmin = context.user.account.isAdmin;
        const nonAdminUserHasAccess = valueIsNotEmpty( params.usersIds ) && params.usersIds.includes( context.user.id.getValue() );

        if( !loggedUserIsAdmin && !nonAdminUserHasAccess ) {
            throw new ForbiddenException();
        }

        const validation = ValidationChain.validate<typeof params>()
                                          .isUUIDv4List( params.companiesIds, 'companiesIds', true )
                                          .isUUIDv4List( params.usersIds, 'usersIds', true )
                                          .isUUIDv4List( params.clientsIds, 'clientsIds', true )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const query = new GetAllDocumentsQuery( { context, params } );
        const result: Result<Document[]> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelsToDocumentDtoList( result.value! );
    }
}
