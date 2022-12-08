import { CompanyPricingProfile } from '@company/models/company-pricing-profile';
import { ProjectMemberId } from '@projects/models/project-member-id';
import { Audit } from '@shared/models/audit/audit';
import { OptionalPositiveNumber } from '@shared/models/numerical/optional-positive-number';
import { User } from '@users/models/user';

export interface IProjectMember {
    id?: ProjectMemberId;
    user: User;
    pricingProfile: CompanyPricingProfile;
    isCoordinator: boolean;
    allocatedHours: OptionalPositiveNumber;
    audit?: Audit;
}
