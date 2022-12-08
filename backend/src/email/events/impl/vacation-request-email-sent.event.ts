import { IDomainEvent, IDomainEventJsonData } from '@shared/interfaces/generics/domain-event.interface';
import { contextToJson } from '@shared/mappers/context.mappers';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type EventDataPayload = null
type EventData = { context: AuthenticatedContext; payload: EventDataPayload };

export class VacationRequestEmailSentEvent implements IDomainEvent<EventDataPayload> {
    readonly data: EventData;
    readonly name: string;

    constructor(data: EventData) {
        this.data = data;
        this.name = VacationRequestEmailSentEvent.name;
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
