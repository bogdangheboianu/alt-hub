import { CompanyPositionDto } from '@dtos/company-position.dto';

export interface IUpdateEmployeeInfo {
    employeeId: string;
    companyPositionId: CompanyPositionDto | string;
    hiredOn: Date;
}
