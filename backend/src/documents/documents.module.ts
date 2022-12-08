import { ClientModule } from '@clients/client.module';
import { CompanyModule } from '@company/company.module';
import { CreateDocumentHandler } from '@documents/commands/handlers/create-document.handler';
import { DocumentController } from '@documents/controllers/document.controller';
import { DocumentEntity } from '@documents/entities/document.entity';
import { GetAllDocumentsHandler } from '@documents/queries/handlers/get-all-documents.handler';
import { DocumentRepository } from '@documents/repositories/document.repository';
import { DocumentService } from '@documents/services/document.service';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@users/user.module';

const Entities = [
    DocumentEntity
];

const Repositories = [
    DocumentRepository
];

const Controllers = [
    DocumentController
];

const CommandHandlers = [
    CreateDocumentHandler
];

const QueryHandlers = [
    GetAllDocumentsHandler
];

const Services = [
    DocumentService
];

@Module( {
             controllers: [ ...Controllers ],
             imports    : [
                 TypeOrmModule.forFeature( [ ...Entities ] ),
                 CqrsModule,
                 CompanyModule,
                 UserModule,
                 ClientModule
             ],
             providers  : [
                 ...Repositories,
                 ...QueryHandlers,
                 ...Services,
                 ...CommandHandlers
             ],
             exports    : []
         } )
export class DocumentsModule {
}
