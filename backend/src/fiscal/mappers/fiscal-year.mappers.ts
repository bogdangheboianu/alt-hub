import { AnnualEmployeeSheetDto } from '@fiscal/dtos/annual-employee-sheet.dto';
import { FiscalYearDto } from '@fiscal/dtos/fiscal-year.dto';
import { AnnualEmployeeSheet } from '@fiscal/models/annual-employee-sheet';
import { FiscalYear } from '@fiscal/models/fiscal-year';
import { modelToAuditDto } from '@shared/mappers/audit.mappers';
import { modelToUserDto } from '@users/mappers/user.mappers';

export const modelToFiscalYearDto = (model: FiscalYear): FiscalYearDto => (
    {
        id                  : model.id.getValue(),
        type                : model.type.getValue(),
        startDate           : model.dateInterval.from.getValue(),
        endDate             : model.dateInterval.to.getValue(),
        annualEmployeeSheets: modelsToAnnualEmployeeSheetDtoList( model.annualEmployeeSheets ),
        audit               : modelToAuditDto( model.audit )
    }
);

export const modelToAnnualEmployeeSheetDto = (model: AnnualEmployeeSheet): AnnualEmployeeSheetDto => (
    {
        id                    : model.id.getValue(),
        paidLeaveDays         : model.paidLeaveDays.getValue(),
        remainingPaidLeaveDays: model.remainingPaidLeaveDays.getValue(),
        user                  : modelToUserDto( model.user ),
        fiscalYearId          : model.fiscalYearId.getValue(),
        audit                 : modelToAuditDto( model.audit )
    }
);

export const modelsToAnnualEmployeeSheetDtoList = (models: AnnualEmployeeSheet[]): AnnualEmployeeSheetDto[] => models.map( modelToAnnualEmployeeSheetDto );

export const modelsToFiscalYearDtoList = (models: FiscalYear[]): FiscalYearDto[] => models.map( modelToFiscalYearDto );
