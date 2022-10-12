import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { OptionalDate } from '@shared/models/date/optional-date';
import { Counter } from '@shared/models/numerical/counter';
import { OptionalUserId } from '@users/models/optional-user-id';

export interface IAudit {
    createdAt?: MandatoryDate;
    createdBy?: OptionalUserId;
    updatedAt?: OptionalDate;
    updatedBy?: OptionalUserId;
    version?: Counter;
}
