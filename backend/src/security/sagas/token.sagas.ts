import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { InvalidateTokenCommand } from '@security/commands/impl/token/invalidate-token.command';
import { TokenStatusEnum } from '@security/enums/token/token-status.enum';
import { TokenExpiredEvent } from '@security/events/impl/token/token-expired.event';
import { map, Observable } from 'rxjs';

@Injectable()
export class TokenSagas {
    @Saga()
    tokenExpired$ = (event$: Observable<any>): Observable<ICommand> => {
        return event$.pipe(
            ofType( TokenExpiredEvent ),
            map( ({ data: { context, payload: token } }) => new InvalidateTokenCommand(
                {
                    context,
                    payload: { token, nonActiveStatus: TokenStatusEnum.Expired }
                }
            ) )
        );
    };
}
