import { CompanyPricingProfileDto } from '@company/dtos/company-pricing-profile.dto';
import { AuditDto } from '@shared/dtos/audit.dto';
import { UserDto } from '@users/dtos/user.dto';

export class ProjectMemberDto {
    id!: string;
    user!: UserDto;
    pricingProfile!: CompanyPricingProfileDto | null;
    isCoordinator!: boolean;
    allocatedHours!: number | null;
    audit!: AuditDto;
}
