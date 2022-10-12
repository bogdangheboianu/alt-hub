import { AuditDto } from '@shared/dtos/audit.dto';

export class ClientDto {
    id!: string;
    name!: string;
    slug!: string;
    audit!: AuditDto;
}
