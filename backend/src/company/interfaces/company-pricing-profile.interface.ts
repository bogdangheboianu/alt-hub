import { CompanyPosition } from '@company/models/company-position';
import { CompanyPricingProfileId } from '@company/models/company-pricing-profile-id';
import { CompanyPricingProfileName } from '@company/models/company-pricing-profile-name';
import { Audit } from '@shared/models/audit/audit';
import { Money } from '@shared/models/money/money';

export interface ICompanyPricingProfile {
    id?: CompanyPricingProfileId;
    name: CompanyPricingProfileName;
    position: CompanyPosition;
    hourlyRate: Money;
    audit: Audit;
}
