import { ClientId } from '@clients/models/value-objects/client-id';
import { ProjectId } from '@projects/models/project-id';
import { Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { Result } from '@shared/models/generics/result';
import { User } from '@users/models/user';
import { UserId } from '@users/models/user-id';
import { GetAllCsvWorkLogsParamsDto } from '@work-logs/dtos/get-all-csv-work-logs-params.dto';
import { GetPaginatedWorkLogsParamsDto } from '@work-logs/dtos/get-paginated-work-logs-params.dto';
import { IWorkLogsSelectionCriteria } from '@work-logs/interfaces/work-logs-selection-criteria.interface';

export const buildWorkLogsSelectionCriteria = (params: GetPaginatedWorkLogsParamsDto | GetAllCsvWorkLogsParamsDto, loggedUser: User): Result<IWorkLogsSelectionCriteria> => {
    const { fromDate, toDate, userId, projectId, clientId } = params;
    return Result.aggregateObjects<IWorkLogsSelectionCriteria>(
        {
            fromDate: valueIsEmpty( fromDate )
                      ? Success( undefined )
                      : MandatoryDate.create( fromDate, 'fromDate' )
        },
        {
            toDate: valueIsEmpty( toDate )
                    ? Success( undefined )
                    : MandatoryDate.create( toDate, 'toDate' )
        },
        {
            userId: loggedUser.account.isAdmin
                    ? valueIsEmpty( userId )
                      ? Success( undefined )
                      : UserId.create( userId, 'userId' )
                    : Success( loggedUser.id )
        },
        {
            projectId: valueIsEmpty( projectId )
                       ? Success( undefined )
                       : ProjectId.create( projectId, 'projectId' )
        },
        {
            clientId: valueIsEmpty( clientId )
                      ? Success( undefined )
                      : ClientId.create( clientId, 'clientId' )
        }
    );
};
