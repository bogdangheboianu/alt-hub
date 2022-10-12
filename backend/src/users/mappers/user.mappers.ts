import { modelToCompanyPositionDto } from '@company/mappers/company-position.mappers';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { modelToAuditDto } from '@shared/mappers/audit.mappers';
import { EmployeeInfoDto } from '@users/dtos/employee-info.dto';
import { PersonalInfoDto } from '@users/dtos/personal-info.dto';
import { UserDto } from '@users/dtos/user.dto';
import { EmployeeInfo } from '@users/models/employee-info';
import { PersonalInfo } from '@users/models/personal-info';
import { User } from '@users/models/user';

export const modelToUserDto = (model: User): UserDto => (
    {
        id          : model.id.getValue(),
        username    : model.username.getValue(),
        status      : model.status.getValue(),
        lastLoginAt : model.lastLoginAt.getValue(),
        isAdmin     : model.isAdmin,
        personalInfo: modelToPersonalInfoDto( model.personalInfo ),
        employeeInfo: modelToEmployeeInfoDto( model.employeeInfo ),
        audit       : modelToAuditDto( model.audit )
    }
);

export const modelsToUserDtoList = (models: User[]): UserDto[] => models.map( modelToUserDto );

const modelToPersonalInfoDto = (model: PersonalInfo): PersonalInfoDto => (
    {
        firstName  : model.fullName.firstName,
        lastName   : model.fullName.lastName,
        email      : model.email.getValue(),
        phone      : model.phone.getValue(),
        dateOfBirth: model.dateOfBirth.getValue(),
        ssn        : model.ssn.getValue(),
        address    : model.address.getValue()
    }
);

const modelToEmployeeInfoDto = (model: EmployeeInfo): EmployeeInfoDto => (
    {
        employeeId     : model.employeeId.getValue(),
        companyPosition: valueIsNotEmpty( model.companyPosition )
                         ? modelToCompanyPositionDto( model.companyPosition )
                         : null,
        hiredOn        : model.hiredOn.getValue(),
        leftOn         : model.leftOn.getValue()
    }
);

