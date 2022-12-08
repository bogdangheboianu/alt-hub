import { SendVacationRequestEmailCommand } from '@email/commands/impl/send-vacation-request-email.command';
import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { VacationRequestCreatedEvent } from '@vacations/events/impl/vacation-request-created.event';
import { VacationRequestUpdatedEvent } from '@vacations/events/impl/vacation-request-updated.event';
import { map, Observable } from 'rxjs';

@Injectable()
export class VacationSagas {
    @Saga()
    vacationRequested$ = (event$: Observable<any>): Observable<ICommand> => {
        return event$.pipe(
            ofType( VacationRequestCreatedEvent, VacationRequestUpdatedEvent ),
            map( ({ data: { context, payload } }) => new SendVacationRequestEmailCommand( { context, payload: { vacation: payload } } ) )
        );
    };
}
