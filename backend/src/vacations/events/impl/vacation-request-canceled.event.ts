import { IDomainEvent, IDomainEventJsonData } from '@shared/interfaces/generics/domain-event.interface';
import { contextToJson } from '@shared/mappers/context.mappers';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { Vacation } from '@vacations/models/vacation';

type EventDataPayload = Vacation
type EventData = { context: AuthenticatedContext; payload: EventDataPayload };

export class VacationRequestCanceledEvent implements IDomainEvent<EventDataPayload> {
    readonly data: EventData;
    readonly name: string;

    constructor(data: EventData) {
        this.data = data;
        this.name = VacationRequestCanceledEvent.name;
    }

    toJson(): IDomainEventJsonData {
        const { context, payload } = this.data;
        return {
            name   : this.name,
            context: contextToJson( context ),
            payload: payload.toEntity(),
            errors : null
        };
    }
}
