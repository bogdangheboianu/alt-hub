import { CompanyPositionId } from '@company/models/position/company-position-id';
import { CompanyPositionName } from '@company/models/position/company-position-name';
import { Audit } from '@shared/models/audit/audit';
import { Slug } from '@shared/models/identification/slug';

export interface ICompanyPosition {
    id?: CompanyPositionId;
    name: CompanyPositionName;
    slug?: Slug;
    audit?: Audit;
}
