import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class GetCurrentAnnualEmployeeSheetParamsDto {
    userId!: string;
}
