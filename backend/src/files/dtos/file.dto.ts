import { AuditDto } from '@shared/dtos/audit.dto';

export class FileDto {
    id!: string;
    name!: string;
    mimeType!: string;
    audit!: AuditDto;
}
