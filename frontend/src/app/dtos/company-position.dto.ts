import { AuditDto } from '@dtos/audit.dto';

export class CompanyPositionDto {
    id!: string;
    name!: string;
    slug!: string;
    audit!: AuditDto;
}
