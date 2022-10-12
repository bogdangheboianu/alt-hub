import { CompanyDto } from '@company/dtos/company.dto';
import { modelsToCompanyPositionDtoList } from '@company/mappers/company-position.mappers';
import { Company } from '@company/models/company/company';
import { modelToAuditDto } from '@shared/mappers/audit.mappers';

export const modelToCompanyDto = (model: Company): CompanyDto => (
    {
        name     : model.name.getValue(),
        positions: modelsToCompanyPositionDtoList( model.positions ),
        audit    : modelToAuditDto( model.audit )
    }
);

