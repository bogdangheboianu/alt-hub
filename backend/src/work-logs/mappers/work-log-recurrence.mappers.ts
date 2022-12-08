import { modelToProjectDto } from '@projects/mappers/project.mappers';
import { modelToAuditDto } from '@shared/mappers/audit.mappers';
import { modelToUserDto } from '@users/mappers/user.mappers';
import { WorkLogRecurrenceDto } from '@work-logs/dtos/work-log-recurrence.dto';
import { WorkLogRecurrence } from '@work-logs/models/work-log-recurrence';

export const modelToWorkLogRecurrenceDto = (model: WorkLogRecurrence, forAdmin: boolean): WorkLogRecurrenceDto => (
    {
        id           : model.id.getValue(),
        minutesLogged: model.minutesLogged.getValue(),
        user         : modelToUserDto( model.user ),
        project      : modelToProjectDto( model.project, forAdmin ),
        weekDays     : model.weekDays.map( wd => wd.getValue() ),
        active       : model.active,
        audit        : modelToAuditDto( model.audit )
    }
);

export const modelsToWorkLogRecurrenceDtoList = (models: WorkLogRecurrence[], forAdmin: boolean): WorkLogRecurrenceDto[] => models.map( m => modelToWorkLogRecurrenceDto( m, forAdmin ) );
