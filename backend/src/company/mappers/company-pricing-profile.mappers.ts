import { CompanyPricingProfileDto } from '@company/dtos/company-pricing-profile.dto';
import { modelToCompanyPositionDto } from '@company/mappers/company-position.mappers';
import { CompanyPricingProfile } from '@company/models/company-pricing-profile';
import { modelToAuditDto } from '@shared/mappers/audit.mappers';
import { modelToMoneyDto } from '@shared/mappers/money.mappers';

export const modelToCompanyPricingProfileDto = (model: CompanyPricingProfile): CompanyPricingProfileDto => (
    {
        id        : model.id.getValue(),
        name      : model.name.getValue(),
        position  : modelToCompanyPositionDto( model.position ),
        hourlyRate: modelToMoneyDto( model.hourlyRate ),
        audit     : modelToAuditDto( model.audit )
    }
);

export const modelsToCompanyPricingProfileDtoList = (models: CompanyPricingProfile[]): CompanyPricingProfileDto[] => models.map( modelToCompanyPricingProfileDto );
