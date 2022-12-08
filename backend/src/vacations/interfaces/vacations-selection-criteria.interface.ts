import { AnnualEmployeeSheetId } from '@fiscal/models/annual-employee-sheet-id';
import { FiscalYearId } from '@fiscal/models/fiscal-year-id';
import { UserId } from '@users/models/user-id';

export interface IVacationsSelectionCriteria {
    fiscalYearId?: FiscalYearId;
    annualEmployeeSheetId?: AnnualEmployeeSheetId;
    userId?: UserId;
}
