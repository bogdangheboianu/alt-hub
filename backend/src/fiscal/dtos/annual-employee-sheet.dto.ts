import { AuditDto } from '@shared/dtos/audit.dto';
import { UserDto } from '@users/dtos/user.dto';

export class AnnualEmployeeSheetDto {
    id!: string;
    paidLeaveDays!: number;
    remainingPaidLeaveDays!: number;
    user!: UserDto;
    fiscalYearId!: string;
    audit!: AuditDto;
}
