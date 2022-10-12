import { AuditDto } from '@shared/dtos/audit.dto';

export class CompanyPositionDto {
    id!: string;
    name!: string;
    slug!: string;
    audit!: AuditDto;
}
