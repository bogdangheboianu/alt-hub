import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { Address } from '@users/models/address';
import { EmailAddress } from '@users/models/email-address';
import { FullName } from '@users/models/full-name';
import { PhoneNumber } from '@users/models/phone-number';
import { SocialSecurityNumber } from '@users/models/social-security-number';

export interface IPersonalInfo {
    fullName: FullName;
    email: EmailAddress;
    phone: PhoneNumber;
    dateOfBirth: MandatoryDate;
    ssn: SocialSecurityNumber;
    address: Address;
}
