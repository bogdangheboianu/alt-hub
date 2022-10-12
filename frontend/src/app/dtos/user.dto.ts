import { AuditDto } from '@dtos/audit.dto';
import { EmployeeInfoDto } from '@dtos/employee-info.dto';
import { PersonalInfoDto } from '@dtos/personal-info.dto';
import { UserStatusEnum } from '@dtos/user-status.enum';

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
