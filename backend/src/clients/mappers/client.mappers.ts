import { ClientDto } from '@clients/dtos/client.dto';
import { Client } from '@clients/models/domain-models/client';
import { modelToAuditDto } from '@shared/mappers/audit.mappers';

export const modelToClientDto = (model: Client): ClientDto => (
    {
        id   : model.id.getValue(),
        name : model.name.getValue(),
        slug : model.slug.getValue(),
        audit: modelToAuditDto( model.audit )
    }
);

export const modelsToClientDtoList = (models: Client[]): ClientDto[] => models.map( modelToClientDto );
