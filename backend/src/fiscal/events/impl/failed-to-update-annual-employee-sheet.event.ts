import { IDomainEvent, IDomainEventJsonData } from '@shared/interfaces/generics/domain-event.interface';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { contextToJson } from '@shared/mappers/context.mappers';
import { errorsToJson } from '@shared/mappers/error.mappers';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type EventData = { context: AuthenticatedContext; errors: IException[] };

export class FailedToUpdateAnnualEmployeeSheetEvent implements IDomainEvent<null> {
    readonly data: EventData;
    readonly name: string;

    constructor(data: EventData) {
        this.data = data;
        this.name = FailedToUpdateAnnualEmployeeSheetEvent.name;
    }

    toJson(): IDomainEventJsonData {
        const { context, errors } = this.data;
        return {
            name   : this.name,
            context: contextToJson( context ),
            payload: null,
            errors : errorsToJson( errors )
        };
    }
}
