import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { InvalidateTokenCommand } from '@security/commands/impl/token/invalidate-token.command';
import { TokenStatusEnum } from '@security/enums/token/token-status.enum';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { UserConfirmedEvent } from '@users/events/impl/user-confirmed.event';
import { map, Observable, of } from 'rxjs';

@Injectable()
export class UserSagas {
    @Saga()
    userConfirmed$ = (event$: Observable<any>): Observable<ICommand> => {
        return event$.pipe(
            ofType( UserConfirmedEvent ),
            map( ({ data: { context, payload: { accountConfirmationToken } } }) => {
                return valueIsEmpty( accountConfirmationToken )
                       ? of( null )
                       : new InvalidateTokenCommand(
                        {
                            context,
                            payload: {
                                token          : accountConfirmationToken,
                                nonActiveStatus: TokenStatusEnum.Consumed
                            }
                        }
                    );
            } )
        );
    };
}
