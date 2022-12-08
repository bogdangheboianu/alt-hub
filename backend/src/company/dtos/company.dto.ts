import { CompanyPositionDto } from '@company/dtos/company-position.dto';
import { CompanyPricingProfileDto } from '@company/dtos/company-pricing-profile.dto';
import { FiscalYearDto } from '@fiscal/dtos/fiscal-year.dto';
import { AuditDto } from '@shared/dtos/audit.dto';

export class CompanyDto {
    id!: string;
    name!: string;
    positions!: CompanyPositionDto[];
    fiscalYears!: FiscalYearDto[];
    pricingProfiles!: CompanyPricingProfileDto[];
    audit!: AuditDto;
}
