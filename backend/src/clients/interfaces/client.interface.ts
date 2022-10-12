import { ClientId } from '@clients/models/value-objects/client-id';
import { ClientName } from '@clients/models/value-objects/client-name';
import { Audit } from '@shared/models/audit/audit';
import { Slug } from '@shared/models/identification/slug';

export interface IClient {
    id?: ClientId;
    name: ClientName;
    slug?: Slug;
    audit?: Audit;
}
