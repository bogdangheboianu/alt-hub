import { DocumentDto } from '@documents/dtos/document.dto';
import { Document } from '@documents/models/document';
import { modelsToFileDtoList } from '@files/mappers/file.mappers';
import { modelToAuditDto } from '@shared/mappers/audit.mappers';

export const modelToDocumentDto = (model: Document): DocumentDto => (
    {
        id   : model.id.getValue(),
        type : model.type.getValue(),
        files: modelsToFileDtoList( model.files ),
        audit: modelToAuditDto( model.audit )
    }
);

export const modelsToDocumentDtoList = (models: Document[]): DocumentDto[] => models.map( modelToDocumentDto );
