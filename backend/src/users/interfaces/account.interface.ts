import { OptionalDate } from '@shared/models/date/optional-date';
import { EmailAddress } from '@users/models/email-address';
import { Password } from '@users/models/password';
import { UserStatus } from '@users/models/user-status';
import { Username } from '@users/models/username';

export interface IAccount {
    email: EmailAddress;
    username?: Username;
    password: Password;
    lastLoginAt?: OptionalDate;
    status?: UserStatus;
    isAdmin: boolean;
}
