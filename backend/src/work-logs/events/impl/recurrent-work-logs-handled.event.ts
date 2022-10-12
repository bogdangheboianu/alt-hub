import { IDomainEvent, IDomainEventJsonData } from '@shared/interfaces/generics/domain-event.interface';
import { contextToJson } from '@shared/mappers/context.mappers';
import { InternalContext } from '@shared/models/context/internal-context';
import { WorkLog } from '@work-logs/models/work-log';

type EventDataPayload = WorkLog[];
type EventData = { context: InternalContext; payload: EventDataPayload };

export class RecurrentWorkLogsHandledEvent implements IDomainEvent<EventDataPayload> {
    readonly data: EventData;
    readonly name: string;

    constructor(data: EventData) {
        this.data = data;
        this.name = RecurrentWorkLogsHandledEvent.name;
    }

    toJson(): IDomainEventJsonData {
        const { context, payload } = this.data;
        return {
            name   : this.name,
            context: contextToJson( context ),
            payload: payload.map( workLog => workLog.toEntity() ),
            errors : null
        };
    }
}
