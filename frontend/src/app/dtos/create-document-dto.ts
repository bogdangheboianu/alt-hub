import { DocumentTypeEnum } from './document-type-enum';

// FIXME: not imported by openapi generator
export interface CreateDocumentDto {
    type: DocumentTypeEnum;
    usersIds?: Array<string>;
    clientsIds?: Array<string>;
}

