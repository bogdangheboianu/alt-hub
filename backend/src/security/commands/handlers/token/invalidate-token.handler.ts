import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { InvalidateTokenCommand } from '@security/commands/impl/token/invalidate-token.command';
import { FailedToInvalidateTokenEvent } from '@security/events/impl/token/failed-to-invalidate-token.event';
import { TokenGeneratedEvent } from '@security/events/impl/token/token-generated.event';
import { Token } from '@security/models/token/token';
import { TokenRepository } from '@security/repositories/token.repository';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseAsyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';

@CommandHandler( InvalidateTokenCommand )
export class InvalidateTokenHandler extends BaseAsyncCommandHandler<InvalidateTokenCommand> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly tokenRepository: TokenRepository
    ) {
        super();
    }

    async execute(command: InvalidateTokenCommand): Promise<void> {
        const invalidatedToken = this.invalidateToken( command );

        if( invalidatedToken.isFailed ) {
            return this.failed( command, ...invalidatedToken.errors );
        }

        const savedToken = await this.saveTokenToDb( invalidatedToken.value! );

        return this.successful( command, savedToken );
    }

    protected failed(command: InvalidateTokenCommand, ...errors: IException[]): void {
        const { context } = command.data;
        const event = new FailedToInvalidateTokenEvent( { context, errors } );

        this.eventBus.publish( event );
    }

    protected successful(command: InvalidateTokenCommand, token: Token): void {
        const { context } = command.data;
        const event = new TokenGeneratedEvent( { context, payload: token } );

        this.eventBus.publish( event );
    }

    private invalidateToken(command: InvalidateTokenCommand): Result<Token> {
        const { payload: { token, nonActiveStatus } } = command.data;
        return token.invalidate( nonActiveStatus );
    }

    private async saveTokenToDb(token: Token): Promise<Token> {
        return await this.tokenRepository.saveToken( token );
    }
}
