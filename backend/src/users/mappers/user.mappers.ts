import { modelToCompanyPositionDto } from '@company/mappers/company-position.mappers';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { modelToAuditDto } from '@shared/mappers/audit.mappers';
import { AccountDto } from '@users/dtos/account.dto';
import { EmploymentInfoDto } from '@users/dtos/employment-info.dto';
import { PersonalInfoDto } from '@users/dtos/personal-info.dto';
import { UserDto } from '@users/dtos/user.dto';
import { Account } from '@users/models/account';
import { EmploymentInfo } from '@users/models/employement-info';
import { PersonalInfo } from '@users/models/personal-info';
import { User } from '@users/models/user';

export const modelToUserDto = (model: User): UserDto => (
    {
        id            : model.id.getValue(),
        account       : modelToAccountDto( model.account ),
        personalInfo  : modelToPersonalInfoDto( model.personalInfo ),
        employmentInfo: modelToEmployeeInfoDto( model.employmentInfo ),
        audit         : modelToAuditDto( model.audit )
    }
);

export const modelsToUserDtoList = (models: User[]): UserDto[] => models.map( modelToUserDto );

const modelToPersonalInfoDto = (model: PersonalInfo): PersonalInfoDto => (
    {
        firstName  : model.fullName.firstName,
        lastName   : model.fullName.lastName,
        phone      : model.phone.getValue(),
        dateOfBirth: model.dateOfBirth.getValue(),
        ssn        : model.ssn.getValue(),
        address    : model.address.getValue()
    }
);

const modelToEmployeeInfoDto = (model: EmploymentInfo): EmploymentInfoDto => (
    {
        employeeId     : model.employeeId.getValue(),
        companyPosition: valueIsNotEmpty( model.companyPosition )
                         ? modelToCompanyPositionDto( model.companyPosition )
                         : null,
        hiredOn        : model.hiredOn.getValue(),
        leftOn         : model.leftOn.getValue()
    }
);

const modelToAccountDto = (model: Account): AccountDto => (
    {
        email      : model.email.getValue(),
        username   : model.username.getValue(),
        status     : model.status.getValue(),
        lastLoginAt: model.lastLoginAt.getValue(),
        isAdmin    : model.isAdmin
    }
);

