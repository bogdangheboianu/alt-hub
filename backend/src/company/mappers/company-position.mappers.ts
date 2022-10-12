import { CompanyPositionDto } from '@company/dtos/company-position.dto';
import { CompanyPosition } from '@company/models/position/company-position';
import { modelToAuditDto } from '@shared/mappers/audit.mappers';

export const modelToCompanyPositionDto = (model: CompanyPosition): CompanyPositionDto => (
    {
        id   : model.id.getValue(),
        name : model.name.getValue(),
        slug : model.slug.getValue(),
        audit: modelToAuditDto( model.audit )
    }
);

export const modelsToCompanyPositionDtoList = (models: CompanyPosition[]): CompanyPositionDto[] => models.map( modelToCompanyPositionDto );
