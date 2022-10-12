import { TokenId } from '@security/models/token/token-id';
import { TokenPurpose } from '@security/models/token/token-purpose';
import { TokenStatus } from '@security/models/token/token-status';
import { TokenValue } from '@security/models/token/token-value';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { OptionalPositiveNumber } from '@shared/models/numerical/optional-positive-number';
import { User } from '@users/models/user';

export interface IToken {
    id?: TokenId;
    value: TokenValue;
    generatedAt?: MandatoryDate;
    validForMinutes?: OptionalPositiveNumber;
    status?: TokenStatus;
    purpose: TokenPurpose;
    user?: User | null;
}
