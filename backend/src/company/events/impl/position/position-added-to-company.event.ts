import { Company } from '@company/models/company/company';
import { CompanyPosition } from '@company/models/position/company-position';
import { IDomainEvent, IDomainEventJsonData } from '@shared/interfaces/generics/domain-event.interface';
import { contextToJson } from '@shared/mappers/context.mappers';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type EventDataPayload = { company: Company; companyPosition: CompanyPosition }
type EventData = { context: AuthenticatedContext; payload: EventDataPayload };

export class PositionAddedToCompanyEvent implements IDomainEvent<EventDataPayload> {
    readonly data: EventData;
    readonly name: string;

    constructor(data: EventData) {
        this.data = data;
        this.name = PositionAddedToCompanyEvent.name;
    }

    toJson(): IDomainEventJsonData {
        const { context, payload: { company } } = this.data;
        return {
            name   : this.name,
            context: contextToJson( context ),
            payload: company.toEntity(),
            errors : null
        };
    }
}
