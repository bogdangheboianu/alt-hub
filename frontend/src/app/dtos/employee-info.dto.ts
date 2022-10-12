import { CompanyPositionDto } from '@dtos/company-position.dto';

export class EmployeeInfoDto {
    employeeId!: string;
    companyPosition!: CompanyPositionDto;
    hiredOn!: Date;
    leftOn!: Date | null;
}
