import { modelToProjectDto } from '@projects/mappers/project.mappers';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { modelToPaginatedResultDto } from '@shared/mappers/paginated-result.mappers';
import { PaginatedResult } from '@shared/models/generics/paginated-result';
import { modelToUserDto } from '@users/mappers/user.mappers';
import { PaginatedWorkLogsDto } from '@work-logs/dtos/paginated-work-logs.dto';
import { WorkLogDto } from '@work-logs/dtos/work-log.dto';
import { modelToWorkLogRecurrenceDto } from '@work-logs/mappers/work-log-recurrence.mappers';
import { WorkLog } from '@work-logs/models/work-log';

export const modelToWorkLogDto = (model: WorkLog, forAdmin: boolean): WorkLogDto => (
    {
        id           : model.id.getValue(),
        minutesLogged: model.minutesLogged.getValue(),
        date         : model.date.getValue(),
        description  : model.description.getValue(),
        user         : valueIsNotEmpty( model.user )
                       ? modelToUserDto( model.user )
                       : null,
        userFullName : model.userFullName.joined,
        project      : valueIsNotEmpty( model.project )
                       ? modelToProjectDto( model.project, forAdmin )
                       : null,
        projectName  : model.projectName.getValue(),
        recurrence   : valueIsEmpty( model.recurrence )
                       ? null
                       : modelToWorkLogRecurrenceDto( model.recurrence, forAdmin )
    }
);

export const modelsToWorkLogDtoList = (models: WorkLog[], forAdmin: boolean): WorkLogDto[] => models.map( m => modelToWorkLogDto( m, forAdmin ) );

export const modelToPaginatedWorkLogsDto = (model: PaginatedResult<WorkLog>, forAdmin: boolean): PaginatedWorkLogsDto => (
    {
        data: modelsToWorkLogDtoList( model.data, forAdmin ),
        ...modelToPaginatedResultDto( model )
    }
);
