import { CompanyPosition } from '@company/models/position/company-position';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { OptionalDate } from '@shared/models/date/optional-date';
import { EmployeeId } from '@users/models/employee-id';

export interface IEmployeeInfo {
    employeeId: EmployeeId;
    companyPosition: CompanyPosition;
    hiredOn: MandatoryDate;
    leftOn?: OptionalDate;
}
