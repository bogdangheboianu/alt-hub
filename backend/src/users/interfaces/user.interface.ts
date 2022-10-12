import { Audit } from '@shared/models/audit/audit';
import { OptionalDate } from '@shared/models/date/optional-date';
import { EmployeeInfo } from '@users/models/employee-info';
import { Password } from '@users/models/password';
import { PersonalInfo } from '@users/models/personal-info';
import { UserId } from '@users/models/user-id';
import { UserStatus } from '@users/models/user-status';
import { Username } from '@users/models/username';

export interface IUser {
    id?: UserId;
    username?: Username;
    password: Password;
    lastLoginAt?: OptionalDate;
    status?: UserStatus;
    isAdmin: boolean;
    personalInfo: PersonalInfo;
    employeeInfo: EmployeeInfo;
    audit?: Audit;
}
