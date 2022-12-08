import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from '@projects/project.module';
import { UserModule } from '@users/user.module';
import { VacationsModule } from '@vacations/vacations.module';
import { ActivateWorkLogRecurrenceHandler } from '@work-logs/commands/handlers/activate-work-log-recurrence.handler';
import { CreateWorkLogRecurrenceHandler } from '@work-logs/commands/handlers/create-work-log-recurrence.handler';
import { CreateWorkLogsHandler } from '@work-logs/commands/handlers/create-work-logs.handler';
import { DeactivateWorkLogRecurrenceHandler } from '@work-logs/commands/handlers/deactivate-work-log-recurrence.handler';
import { DeleteWorkLogRecurrenceHandler } from '@work-logs/commands/handlers/delete-work-log-recurrence.handler';
import { DeleteWorkLogHandler } from '@work-logs/commands/handlers/delete-work-log.handler';
import { HandleRecurrentWorkLogsHandler } from '@work-logs/commands/handlers/handle-recurrent-work-logs.handler';
import { ImportWorkLogsFromFileHandler } from '@work-logs/commands/handlers/import-work-logs-from-file.handler';
import { UpdateWorkLogRecurrenceHandler } from '@work-logs/commands/handlers/update-work-log-recurrence.handler';
import { UpdateWorkLogHandler } from '@work-logs/commands/handlers/update-work-log.handler';
import { WorkLogController } from '@work-logs/controllers/work-log.controller';
import { WorkLogRecurrenceEntity } from '@work-logs/entities/work-log-recurrence.entity';
import { WorkLogEntity } from '@work-logs/entities/work-log.entity';
import { GetAllCsvWorkLogsHandler } from '@work-logs/queries/handlers/get-all-csv-work-logs.handler';
import { GetAllUserWorkLogRecurrencesHandler } from '@work-logs/queries/handlers/get-all-user-work-log-recurrences.handler';
import { GetPaginatedWorkLogsHandler } from '@work-logs/queries/handlers/get-paginated-work-logs.handler';
import { WorkLogRecurrenceRepository } from '@work-logs/repositories/work-log-recurrence.repository';
import { WorkLogRepository } from '@work-logs/repositories/work-log.repository';
import { WorkLogRecurrenceScheduler } from '@work-logs/schedulers/work-log-recurrence.scheduler';
import { WorkLogRecurrenceService } from '@work-logs/services/work-log-recurrence.service';
import { WorkLogService } from '@work-logs/services/work-log.service';

const Entities = [
    WorkLogEntity,
    WorkLogRecurrenceEntity
];

const Services = [
    WorkLogService,
    WorkLogRecurrenceService
];

const Repositories = [
    WorkLogRepository,
    WorkLogRecurrenceRepository
];

const Controllers = [
    WorkLogController
];

const CommandHandlers = [
    CreateWorkLogsHandler,
    CreateWorkLogRecurrenceHandler,
    HandleRecurrentWorkLogsHandler,
    UpdateWorkLogHandler,
    UpdateWorkLogRecurrenceHandler,
    ActivateWorkLogRecurrenceHandler,
    DeactivateWorkLogRecurrenceHandler,
    ImportWorkLogsFromFileHandler,
    DeleteWorkLogHandler,
    DeleteWorkLogRecurrenceHandler
];

const QueryHandlers = [
    GetPaginatedWorkLogsHandler,
    GetAllUserWorkLogRecurrencesHandler,
    GetAllCsvWorkLogsHandler
];

const Schedulers = [
    WorkLogRecurrenceScheduler
];

@Module( {
             imports    : [
                 TypeOrmModule.forFeature( [ ...Entities ] ),
                 CqrsModule,
                 ProjectModule,
                 UserModule,
                 VacationsModule
             ],
             controllers: [ ...Controllers ],
             providers  : [
                 ...Services,
                 ...Repositories,
                 ...CommandHandlers,
                 ...QueryHandlers,
                 ...Schedulers
             ]
         } )
export class WorkLogModule {
}
