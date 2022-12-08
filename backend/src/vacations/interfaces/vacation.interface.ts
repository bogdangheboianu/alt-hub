import { AnnualEmployeeSheet } from '@fiscal/models/annual-employee-sheet';
import { Audit } from '@shared/models/audit/audit';
import { DateClosedInterval } from '@shared/models/date/date-closed-interval';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import { VacationId } from '@vacations/models/vacation-id';
import { VacationReason } from '@vacations/models/vacation-reason';
import { VacationStatus } from '@vacations/models/vacation-status';
import { VacationType } from '@vacations/models/vacation-type';

export interface IVacation {
    id?: VacationId;
    type: VacationType;
    status?: VacationStatus;
    reason?: VacationReason;
    dateInterval: DateClosedInterval;
    workingDays: PositiveNumber;
    approved?: boolean;
    annualEmployeeSheet: AnnualEmployeeSheet;
    audit?: Audit;
}
