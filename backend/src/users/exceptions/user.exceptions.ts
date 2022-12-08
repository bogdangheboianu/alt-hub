import { BaseException } from '@shared/models/base-exception/base-exception';
import { UserStatus } from '@users/models/user-status';

export class DuplicateEmailAddressException extends BaseException {
    name = 'duplicate_user_email';
    message = 'A user with this email address already exists';
    field = 'email';
}

export class DuplicateSocialSecurityNumberException extends BaseException {
    name = 'duplicate_social_security_number';
    message = 'A user with this social security number already exists';
    field = 'ssn';
}

export class DuplicatePhoneNumberException extends BaseException {
    name = 'duplicate_phone_number';
    message = 'A user with this phone number already exists';
    field = 'phone';
}

export class DuplicateEmployeeIdException extends BaseException {
    name = 'duplicate_employee_id';
    message = 'A user with this employee id already exists';
    field = 'phone';
}

export class UserNotFoundException extends BaseException {
    name = 'user_not_found';
    message = 'No user was found with given input';
}

export class IncompatibleUserStatusException extends BaseException {
    name = 'incompatible_user_status';

    constructor(currentStatus: UserStatus, newStatus: UserStatus) {
        super();
        this.message = `Cannot update user status from ${ currentStatus.getValue() } to ${ newStatus.getValue() }`;
    }
}

export class UserInactiveException extends BaseException {
    name = 'user_status_inactive';
    message = `User is inactive`;
}
