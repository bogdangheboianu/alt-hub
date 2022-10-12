import { AuditDto } from '@dtos/audit.dto';
import { CompanyPositionDto } from '@dtos/company-position.dto';

export class CompanyDto {
    name!: string;
    positions!: CompanyPositionDto[];
    audit!: AuditDto;
}
