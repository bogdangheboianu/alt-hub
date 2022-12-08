import { modelToAnnualEmployeeSheetDto } from '@fiscal/mappers/fiscal-year.mappers';
import { modelToAuditDto } from '@shared/mappers/audit.mappers';
import { VacationDto } from '@vacations/dtos/vacation.dto';
import { Vacation } from '@vacations/models/vacation';

export const modelToVacationDto = (model: Vacation): VacationDto => (
    {
        id                 : model.id.getValue(),
        type               : model.type.getValue(),
        status             : model.status.getValue(),
        reason             : model.reason.getValue(),
        fromDate           : model.dateInterval.from.getValue(),
        toDate             : model.dateInterval.to.getValue(),
        workingDays        : model.workingDays.getValue(),
        approved           : model.approved,
        annualEmployeeSheet: modelToAnnualEmployeeSheetDto( model.annualEmployeeSheet ),
        audit              : modelToAuditDto( model.audit )
    }
);

export const modelsToVacationDtoList = (models: Vacation[]): VacationDto[] => models.map( modelToVacationDto );
