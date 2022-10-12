import { AuditDto } from '@shared/dtos/audit.dto';
import { Audit } from '@shared/models/audit/audit';

export const modelToAuditDto = (model: Audit): AuditDto => (
    {
        createdAt: model.createdAt.getValue(),
        createdBy: model.createdBy.getValue(),
        updatedAt: model.updatedAt.getValue(),
        updatedBy: model.updatedBy.getValue(),
        version  : model.version.getValue()
    }
);
