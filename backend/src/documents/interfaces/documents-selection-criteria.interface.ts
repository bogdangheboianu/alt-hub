import { ClientId } from '@clients/models/value-objects/client-id';
import { CompanyId } from '@company/models/company-id';
import { UserId } from '@users/models/user-id';

export interface IDocumentsSelectionCriteria {
    companiesIds?: CompanyId[];
    usersIds?: UserId[];
    clientsIds?: ClientId[];
}
