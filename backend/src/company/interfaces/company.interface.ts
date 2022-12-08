import { CompanyId } from '@company/models/company-id';
import { CompanyName } from '@company/models/company-name';
import { CompanyPosition } from '@company/models/company-position';
import { CompanyPricingProfile } from '@company/models/company-pricing-profile';
import { FiscalYear } from '@fiscal/models/fiscal-year';
import { Audit } from '@shared/models/audit/audit';

export interface ICompany {
    id?: CompanyId;
    name: CompanyName;
    positions?: CompanyPosition[];
    fiscalYears?: FiscalYear[];
    pricingProfiles?: CompanyPricingProfile[];
    audit?: Audit;
}
