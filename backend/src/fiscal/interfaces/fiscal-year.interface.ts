import { AnnualEmployeeSheet } from '@fiscal/models/annual-employee-sheet';
import { FiscalYearId } from '@fiscal/models/fiscal-year-id';
import { FiscalYearType } from '@fiscal/models/fiscal-year-type';
import { Audit } from '@shared/models/audit/audit';
import { DateClosedInterval } from '@shared/models/date/date-closed-interval';

export interface IFiscalYear {
    id?: FiscalYearId;
    type: FiscalYearType;
    dateInterval: DateClosedInterval;
    annualEmployeeSheets?: AnnualEmployeeSheet[];
    audit?: Audit;
}
