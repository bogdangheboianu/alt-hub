import { BaseException } from '@shared/models/base-exception/base-exception';

export class DuplicateAnnualEmployeeSheetException extends BaseException {
    name = 'duplicate_annual_employee_sheet';
    message = 'There is already another employee sheet on this fiscal year';
}

export class AnnualEmployeeSheetNotFoundException extends BaseException {
    name = 'annual_employee_sheet_not_found';
    message = 'Annual employee sheet not found';
}
