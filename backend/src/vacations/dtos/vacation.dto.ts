import { AnnualEmployeeSheetDto } from '@fiscal/dtos/annual-employee-sheet.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AuditDto } from '@shared/dtos/audit.dto';
import { VacationStatusEnum } from '@vacations/enums/vacation-status.enum';
import { VacationTypeEnum } from '@vacations/enums/vacation-type.enum';

export class VacationDto {
    id!: string;
    @ApiProperty( { enum: VacationTypeEnum, enumName: 'VacationTypeEnum' } )
    type!: VacationTypeEnum;
    @ApiProperty( { enum: VacationStatusEnum, enumName: 'VacationStatusEnum' } )
    status!: VacationStatusEnum;
    reason?: string | null;
    fromDate!: Date;
    toDate!: Date;
    workingDays!: number;
    approved!: boolean;
    annualEmployeeSheet!: AnnualEmployeeSheetDto;
    audit!: AuditDto;
}
