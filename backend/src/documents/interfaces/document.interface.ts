import { Client } from '@clients/models/domain-models/client';
import { Company } from '@company/models/company';
import { DocumentId } from '@documents/models/document-id';
import { DocumentType } from '@documents/models/document-type';
import { File } from '@files/models/file';
import { Audit } from '@shared/models/audit/audit';
import { User } from '@users/models/user';

export interface IDocument {
    id?: DocumentId;
    type: DocumentType;
    files?: File[];
    companies?: Company[];
    clients?: Client[];
    users?: User[];
    audit?: Audit;
}
