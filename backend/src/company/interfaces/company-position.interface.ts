import { CompanyPositionId } from '@company/models/company-position-id';
import { CompanyPositionName } from '@company/models/company-position-name';
import { Audit } from '@shared/models/audit/audit';
import { Slug } from '@shared/models/identification/slug';

export interface ICompanyPosition {
    id?: CompanyPositionId;
    name: CompanyPositionName;
    slug?: Slug;
    audit?: Audit;
}
