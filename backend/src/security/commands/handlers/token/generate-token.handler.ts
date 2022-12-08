import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { GenerateTokenCommand } from '@security/commands/impl/token/generate-token.command';
import { FailedToGenerateTokenEvent } from '@security/events/impl/token/failed-to-generate-token.event';
import { TokenGeneratedEvent } from '@security/events/impl/token/token-generated.event';
import { DuplicateTokenValueException } from '@security/exceptions/token.exceptions';
import { Token } from '@security/models/token/token';
import { TokenValue } from '@security/models/token/token-value';
import { TokenRepository } from '@security/repositories/token.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';

@CommandHandler( GenerateTokenCommand )
export class GenerateTokenHandler extends BaseSyncCommandHandler<GenerateTokenCommand, Token> {
    constructor(
        private readonly tokenRepository: TokenRepository,
        private readonly eventBus: EventBus
    ) {
        super();
    }

    async execute(command: GenerateTokenCommand): Promise<Result<Token>> {
        const tokenValueUniquenessCheck = await this.checkForTokenValueUniqueness( command );

        if( tokenValueUniquenessCheck.isFailed ) {
            return this.failed( command, ...tokenValueUniquenessCheck.errors );
        }

        const token = Token.create( command );

        if( token.isFailed ) {
            return this.failed( command, ...token.errors );
        }

        const savedToken = await this.saveTokenToDb( token.value! );

        return this.successful( command, savedToken );
    }

    protected failed(command: GenerateTokenCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToGenerateTokenEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    protected successful(command: GenerateTokenCommand, token: Token): Result<Token> {
        const { context } = command.data;
        const event = new TokenGeneratedEvent( { context, payload: token } );

        this.eventBus.publish( event );

        return Success( token );
    }

    private async checkForTokenValueUniqueness(command: GenerateTokenCommand): Promise<Result<any>> {
        const { value } = command.data.payload;
        const tokenValue = TokenValue.create( value );

        if( tokenValue.isFailed ) {
            return Failed( ...tokenValue.errors );
        }

        const tokenOrNotFound = await this.tokenRepository.findTokenByValue( tokenValue.value! );

        if( tokenOrNotFound.isFailed ) {
            throw new Exception( tokenOrNotFound.errors );
        }

        if( tokenOrNotFound.isNotFound ) {
            return Success();
        }

        return Failed( new DuplicateTokenValueException() );
    }

    private async saveTokenToDb(token: Token): Promise<Token> {
        return await this.tokenRepository.saveToken( token );
    }
}
