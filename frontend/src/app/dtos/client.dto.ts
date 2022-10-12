import { AuditDto } from '@dtos/audit.dto';

export class ClientDto {
    id!: string;
    name!: string;
    slug!: string;
    audit!: AuditDto;
}
