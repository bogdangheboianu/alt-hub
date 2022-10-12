import { modelToProjectDto } from '@projects/mappers/project.mappers';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { modelToPaginatedResultDto } from '@shared/mappers/paginated-result.mappers';
import { PaginatedResult } from '@shared/models/generics/paginated-result';
import { modelToUserDto } from '@users/mappers/user.mappers';
import { PaginatedWorkLogsDto } from '@work-logs/dtos/paginated-work-logs.dto';
import { WorkLogDto } from '@work-logs/dtos/work-log.dto';
import { modelToWorkLogRecurrenceDto } from '@work-logs/mappers/work-log-recurrence.mappers';
import { WorkLog } from '@work-logs/models/work-log';

export const modelToWorkLogDto = (model: WorkLog): WorkLogDto => (
    {
        id           : model.id.getValue(),
        minutesLogged: model.minutesLogged.getValue(),
        date         : model.date.getValue(),
        description  : model.description.getValue(),
        user         : modelToUserDto( model.user ),
        project      : modelToProjectDto( model.project ),
        recurrence   : valueIsEmpty( model.recurrence )
                       ? null
                       : modelToWorkLogRecurrenceDto( model.recurrence )
    }
);

export const modelsToWorkLogDtoList = (models: WorkLog[]): WorkLogDto[] => models.map( m => modelToWorkLogDto( m ) );

export const modelToPaginatedWorkLogsDto = (model: PaginatedResult<WorkLog>): PaginatedWorkLogsDto => (
    {
        data: modelsToWorkLogDtoList( model.data ),
        ...modelToPaginatedResultDto( model )
    }
);
