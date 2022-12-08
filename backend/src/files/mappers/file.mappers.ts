import { FileDto } from '@files/dtos/file.dto';
import { File } from '@files/models/file';
import { modelToAuditDto } from '@shared/mappers/audit.mappers';

export const modelToFileDto = (model: File): FileDto => (
    {
        id      : model.id.getValue(),
        name    : model.name.getValue(),
        mimeType: model.mimeType.getValue(),
        audit   : modelToAuditDto( model.audit )
    }
);

export const modelsToFileDtoList = (models: File[]): FileDto[] => models.map( modelToFileDto );
