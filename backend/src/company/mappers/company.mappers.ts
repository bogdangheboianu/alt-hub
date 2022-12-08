import { CompanyDto } from '@company/dtos/company.dto';
import { modelsToCompanyPositionDtoList } from '@company/mappers/company-position.mappers';
import { modelsToCompanyPricingProfileDtoList } from '@company/mappers/company-pricing-profile.mappers';
import { Company } from '@company/models/company';
import { modelsToFiscalYearDtoList } from '@fiscal/mappers/fiscal-year.mappers';
import { modelToAuditDto } from '@shared/mappers/audit.mappers';

export const modelToCompanyDto = (model: Company): CompanyDto => (
    {
        id             : model.id.getValue(),
        name           : model.name.getValue(),
        positions      : modelsToCompanyPositionDtoList( model.positions ),
        fiscalYears    : modelsToFiscalYearDtoList( model.fiscalYears ),
        pricingProfiles: modelsToCompanyPricingProfileDtoList( model.pricingProfiles ),
        audit          : modelToAuditDto( model.audit )
    }
);


