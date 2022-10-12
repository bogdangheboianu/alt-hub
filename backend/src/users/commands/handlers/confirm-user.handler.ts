import { CommandBus, CommandHandler, EventBus } from '@nestjs/cqrs';
import { TokenExpiredEvent } from '@security/events/impl/token/token-expired.event';
import { InvalidOrExpiredTokenException } from '@security/exceptions/token.exceptions';
import { Token } from '@security/models/token/token';
import { TokenPurpose } from '@security/models/token/token-purpose';
import { TokenValue } from '@security/models/token/token-value';
import { TokenRepository } from '@security/repositories/token.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { ConfirmUserCommand } from '@users/commands/impl/confirm-user.command';
import { FailedToConfirmUserEvent } from '@users/events/impl/failed-to-confirm-user.event';
import { UserConfirmedEvent } from '@users/events/impl/user-confirmed.event';
import { User } from '@users/models/user';
import { UserRepository } from '@users/repositories/user.repository';

@CommandHandler( ConfirmUserCommand )
export class ConfirmUserHandler extends BaseSyncCommandHandler<ConfirmUserCommand, User> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus,
        private readonly userRepository: UserRepository,
        private readonly tokenRepository: TokenRepository
    ) {
        super();
    }

    async execute(command: ConfirmUserCommand): Promise<Result<User>> {
        const accountConfirmationToken = await this.getAccountConfirmationToken( command );

        if( accountConfirmationToken.isFailed ) {
            return this.failed( command, ...accountConfirmationToken.errors );
        }

        const user = accountConfirmationToken.value!.user!;
        const updatedUser = this.updateUser( command, user );

        if( updatedUser.isFailed ) {
            return this.failed( command, ...updatedUser.errors );
        }

        const savedUser = await this.saveUserToDb( updatedUser.value! );

        return this.successful( command, savedUser, accountConfirmationToken.value! );
    }

    protected successful(command: ConfirmUserCommand, user: User, token?: Token): Result<User> {
        const { context } = command.data;
        const event = new UserConfirmedEvent( { context, payload: { user, accountConfirmationToken: token } } );

        this.eventBus.publish( event );

        return Success( user );
    }

    protected failed(command: ConfirmUserCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToConfirmUserEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getAccountConfirmationToken(command: ConfirmUserCommand): Promise<Result<Token>> {
        const { token: accountConfirmationToken } = command.data.payload;
        const tokenValue = TokenValue.create( accountConfirmationToken );

        if( tokenValue.isFailed ) {
            return Failed( ...tokenValue.errors );
        }

        const token = await this.tokenRepository.findActiveTokenByValueAndPurpose( tokenValue.value!, TokenPurpose.forAccountConfirmation() );

        if( token.isFailed ) {
            throw new Exception( token.errors );
        }

        if( token.isNotFound ) {
            return Failed( new InvalidOrExpiredTokenException() );
        }

        if( token.value!.isNotActive() ) {
            this.emitTokenExpiredEvent( token.value!, command.data.context );
            return Failed( new InvalidOrExpiredTokenException() );
        }

        return token;
    }

    private updateUser(command: ConfirmUserCommand, user: User): Result<User> {
        return user.updateAsConfirmed( command );
    }

    private async saveUserToDb(user: User): Promise<User> {
        const savedUser = await this.userRepository.save( user );

        if( savedUser.isFailed ) {
            throw new Exception( savedUser.errors );
        }

        return savedUser.value!;
    }

    private emitTokenExpiredEvent(token: Token, context: AuthenticatedContext): void {
        const event = new TokenExpiredEvent( { context, payload: token } );
        this.eventBus.publish( event );
    }
}
