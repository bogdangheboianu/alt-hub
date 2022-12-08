import { IDomainEvent, IDomainEventJsonData } from '@shared/interfaces/generics/domain-event.interface';
import { contextToJson } from '@shared/mappers/context.mappers';
import { InternalContext } from '@shared/models/context/internal-context';
import { Holiday } from '@vacations/models/holiday';

type EventDataPayload = Holiday[]
type EventData = { context: InternalContext; payload: EventDataPayload };

export class HolidaysRefreshedEvent implements IDomainEvent<EventDataPayload> {
    readonly data: EventData;
    readonly name: string;

    constructor(data: EventData) {
        this.data = data;
        this.name = HolidaysRefreshedEvent.name;
    }

    toJson(): IDomainEventJsonData {
        const { context, payload } = this.data;
        return {
            name   : this.name,
            context: contextToJson( context ),
            payload: payload.map( h => h.toEntity() ),
            errors : null
        };
    }
}
