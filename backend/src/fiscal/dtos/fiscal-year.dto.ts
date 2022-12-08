import { AnnualEmployeeSheetDto } from '@fiscal/dtos/annual-employee-sheet.dto';
import { FiscalYearTypeEnum } from '@fiscal/enums/fiscal-year-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { AuditDto } from '@shared/dtos/audit.dto';

export class FiscalYearDto {
    id!: string;
    @ApiProperty( { enum: FiscalYearTypeEnum, enumName: 'FiscalYearTypeEnum' } )
    type!: FiscalYearTypeEnum;
    startDate!: Date;
    endDate!: Date;
    annualEmployeeSheets!: AnnualEmployeeSheetDto[];
    audit!: AuditDto;
}
