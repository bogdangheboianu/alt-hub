import { AuditDto } from '@shared/dtos/audit.dto';
import { AccountDto } from '@users/dtos/account.dto';
import { EmploymentInfoDto } from '@users/dtos/employment-info.dto';
import { PersonalInfoDto } from '@users/dtos/personal-info.dto';

export class UserDto {
    id!: string;
    account!: AccountDto;
    personalInfo!: PersonalInfoDto;
    employmentInfo!: EmploymentInfoDto;
    audit!: AuditDto;
}
