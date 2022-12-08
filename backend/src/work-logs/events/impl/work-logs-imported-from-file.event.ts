import { IDomainEvent, IDomainEventJsonData } from '@shared/interfaces/generics/domain-event.interface';
import { contextToJson } from '@shared/mappers/context.mappers';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { WorkLogsFileImportResultDto } from '@work-logs/dtos/work-logs-file-import-result.dto';

type EventDataPayload = WorkLogsFileImportResultDto;
type EventData = { context: AuthenticatedContext; payload: EventDataPayload };

export class WorkLogsImportedFromFileEvent implements IDomainEvent<EventDataPayload> {
    readonly data: EventData;
    readonly name: string;

    constructor(data: EventData) {
        this.data = data;
        this.name = WorkLogsImportedFromFileEvent.name;
    }

    toJson(): IDomainEventJsonData {
        const { context, payload } = this.data;
        return {
            name   : this.name,
            context: contextToJson( context ),
            payload,
            errors : null
        };
    }
}
