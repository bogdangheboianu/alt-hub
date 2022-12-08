import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class GetAllVacationsParamsDto {
    fiscalYearId?: string;
    annualEmployeeSheetId?: string;
}
