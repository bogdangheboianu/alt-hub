import { CompanyPosition } from '@company/models/position/company-position';
import { CompanyId } from '@company/models/company/company-id';
import { CompanyName } from '@company/models/company/company-name';
import { Audit } from '@shared/models/audit/audit';

export interface ICompany {
    id?: CompanyId;
    name: CompanyName;
    positions: CompanyPosition[];
    audit?: Audit;
}
