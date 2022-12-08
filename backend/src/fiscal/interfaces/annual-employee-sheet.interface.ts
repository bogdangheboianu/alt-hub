import { AnnualEmployeeSheetId } from '@fiscal/models/annual-employee-sheet-id';
import { FiscalYearId } from '@fiscal/models/fiscal-year-id';
import { Audit } from '@shared/models/audit/audit';
import { Counter } from '@shared/models/numerical/counter';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import { User } from '@users/models/user';

export interface IAnnualEmployeeSheet {
    id?: AnnualEmployeeSheetId;
    paidLeaveDays: PositiveNumber;
    remainingPaidLeaveDays?: Counter;
    user: User;
    fiscalYearId: FiscalYearId;
    audit?: Audit;
}
