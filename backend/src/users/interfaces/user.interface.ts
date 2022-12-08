import { Audit } from '@shared/models/audit/audit';
import { Account } from '@users/models/account';
import { EmploymentInfo } from '@users/models/employement-info';
import { PersonalInfo } from '@users/models/personal-info';
import { UserId } from '@users/models/user-id';

export interface IUser {
    id?: UserId;
    account: Account;
    personalInfo: PersonalInfo;
    employmentInfo: EmploymentInfo;
    audit?: Audit;
}
