import { FiscalYear } from '@fiscal/models/fiscal-year';
import { IDomainEvent, IDomainEventJsonData } from '@shared/interfaces/generics/domain-event.interface';
import { contextToJson } from '@shared/mappers/context.mappers';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type EventDataPayload = FiscalYear
type EventData = { context: AuthenticatedContext; payload: EventDataPayload };

export class AnnualEmployeeSheetUpdatedEvent implements IDomainEvent<EventDataPayload> {
    readonly data: EventData;
    readonly name: string;

    constructor(data: EventData) {
        this.data = data;
        this.name = AnnualEmployeeSheetUpdatedEvent.name;
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
