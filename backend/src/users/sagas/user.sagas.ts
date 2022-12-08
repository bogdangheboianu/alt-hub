import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { InvalidateTokenCommand } from '@security/commands/impl/token/invalidate-token.command';
import { TokenStatusEnum } from '@security/enums/token/token-status.enum';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { UserActivatedEvent } from '@users/events/impl/user-activated.event';
import { map, Observable, of } from 'rxjs';

@Injectable()
export class UserSagas {
    @Saga()
    userActivated$ = (event$: Observable<any>): Observable<ICommand> => {
        return event$.pipe(
            ofType( UserActivatedEvent ),
            map( ({ data: { context, payload: { accountActivationToken } } }) => {
                return valueIsEmpty( accountActivationToken )
                       ? of( null )
                       : new InvalidateTokenCommand(
                        {
                            context,
                            payload: {
                                token          : accountActivationToken,
                                nonActiveStatus: TokenStatusEnum.Consumed
                            }
                        }
                    );
            } )
        );
    };
}
