import { IDomainEvent, IDomainEventJsonData } from '@shared/interfaces/generics/domain-event.interface';
import { contextToJson } from '@shared/mappers/context.mappers';
import { InternalContext } from '@shared/models/context/internal-context';

type EventDataPayload = null
type EventData = { context: InternalContext; payload: EventDataPayload };

export class WorkLogRecurrenceConfirmationSentEvent implements IDomainEvent<EventDataPayload> {
    readonly data: EventData;
    readonly name: string;

    constructor(data: EventData) {
        this.data = data;
        this.name = WorkLogRecurrenceConfirmationSentEvent.name;
    }

    toJson(): IDomainEventJsonData {
        const { context } = this.data;
        return {
            name   : this.name,
            context: contextToJson( context ),
            payload: null,
            errors : null
        };
    }
}
