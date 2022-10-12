import { AuditDto } from '@shared/dtos/audit.dto';
import { EmployeeInfoDto } from '@users/dtos/employee-info.dto';
import { PersonalInfoDto } from '@users/dtos/personal-info.dto';
import { UserStatusEnum } from '@users/enums/user-status.enum';

export class UserDto {
    id!: string;
    username!: string;
    lastLoginAt!: Date | null;
    status!: UserStatusEnum;
    isAdmin!: boolean;
    personalInfo!: PersonalInfoDto;
    employeeInfo!: EmployeeInfoDto;
    audit!: AuditDto;
}
