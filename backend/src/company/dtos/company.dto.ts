import { CompanyPositionDto } from '@company/dtos/company-position.dto';
import { AuditDto } from '@shared/dtos/audit.dto';

export class CompanyDto {
    name!: string;
    positions!: CompanyPositionDto[];
    audit!: AuditDto;
}
