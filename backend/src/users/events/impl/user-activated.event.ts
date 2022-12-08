import { Token } from '@security/models/token/token';
import { IDomainEvent, IDomainEventJsonData } from '@shared/interfaces/generics/domain-event.interface';
import { contextToJson } from '@shared/mappers/context.mappers';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { User } from '@users/models/user';

type EventDataPayload = { user: User; accountActivationToken?: Token }
type EventData = { context: AuthenticatedContext; payload: EventDataPayload };

export class UserActivatedEvent implements IDomainEvent<EventDataPayload> {
    readonly data: EventData;
    readonly name: string;

    constructor(data: EventData) {
        this.data = data;
        this.name = UserActivatedEvent.name;
    }

    toJson(): IDomainEventJsonData {
        const { context, payload: { user } } = this.data;
        return {
            name   : this.name,
            context: contextToJson( context ),
            payload: user.toEntity(),
            errors : null
        };
    }
}
