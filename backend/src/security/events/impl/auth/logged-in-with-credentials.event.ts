import { LoginResponseDto } from '@security/dtos/login-response.dto';
import { IDomainEvent, IDomainEventJsonData } from '@shared/interfaces/generics/domain-event.interface';
import { contextToJson } from '@shared/mappers/context.mappers';
import { PublicContext } from '@shared/models/context/public-context';
import { User } from '@users/models/user';

type EventDataPayload = { loginResponse: LoginResponseDto; user: User }
type EventData = { context: PublicContext; payload: EventDataPayload };

export class LoggedInWithCredentialsEvent implements IDomainEvent<EventDataPayload> {
    readonly data: EventData;
    readonly name: string;

    constructor(data: EventData) {
        this.data = data;
        this.name = LoggedInWithCredentialsEvent.name;
    }

    toJson(): IDomainEventJsonData {
        const { context, payload: { loginResponse } } = this.data;
        return {
            name   : this.name,
            context: contextToJson( context ),
            payload: loginResponse,
            errors : null
        };
    }
}
