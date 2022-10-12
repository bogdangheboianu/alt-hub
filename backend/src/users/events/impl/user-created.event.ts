import { IDomainEvent, IDomainEventJsonData } from '@shared/interfaces/generics/domain-event.interface';
import { contextToJson } from '@shared/mappers/context.mappers';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { User } from '@users/models/user';

type EventDataPayload = User
type EventData = { context: AuthenticatedContext; payload: EventDataPayload };

export class UserCreatedEvent implements IDomainEvent<EventDataPayload> {
    readonly data: EventData;
    readonly name: string;

    constructor(data: EventData) {
        this.data = data;
        this.name = UserCreatedEvent.name;
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
